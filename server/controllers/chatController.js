import { z } from 'zod';
import { maskPII, unmaskPII, describePII, redactForAuditLog } from '../utils/piiMasker.js';
import { analyzeThreat, generateResponse } from '../utils/gemini.js';
import {
  insertPromptLog,
  getUserPromptHistory,
  clearUserPromptHistory,
  deleteSinglePromptHistory
} from '../utils/supabase.js';

// Zod validation for chat payload
const ChatPayloadSchema = z.object({
  prompt: z.string().min(1, 'Prompt cannot be empty').max(5000, 'Prompt exceeds 5000 character limit'),
  zeroRetention: z.boolean().optional().default(false),
});

/**
 * Threat confidence thresholds:
 *  >= BLOCK_THRESHOLD  → hard block, log, return security warning
 *  >= WARN_THRESHOLD   → allow but add a warning note in the response metadata
 */
const BLOCK_THRESHOLD = 75;
const WARN_THRESHOLD  = 45;

/**
 * Categories we always block regardless of confidence score.
 */
const ALWAYS_BLOCK_CATEGORIES = new Set(['data_exfiltration', 'jailbreak']);

export async function handleChat(req, res) {
  // ── 1. Validate payload ──────────────────────────────────────────
  const parseResult = ChatPayloadSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.errors[0].message });
  }

  const { prompt: originalPrompt, zeroRetention = false } = parseResult.data;
  const userId = req.user.id;

  // ── 2. PII Masking ───────────────────────────────────────────────
  const { maskedText, tokenMap, entitiesFound, breakdown } = maskPII(originalPrompt);

  if (entitiesFound > 0) {
    console.log(`[PII] Masked ${entitiesFound} entit(ies) for user ${userId}: ${describePII(breakdown)}`);
  }

  // ── 3. Threat Detection ──────────────────────────────────────────
  const threatResult = await analyzeThreat(maskedText);

  const isHardBlock =
    (threatResult.isMalicious && threatResult.confidenceScore >= BLOCK_THRESHOLD) ||
    (threatResult.isMalicious && ALWAYS_BLOCK_CATEGORIES.has(threatResult.category));

  const isSoftWarn =
    !isHardBlock &&
    threatResult.isMalicious &&
    threatResult.confidenceScore >= WARN_THRESHOLD;

  if (isHardBlock) {
    console.warn(
      `[THREAT BLOCKED] user=${userId} category=${threatResult.category} confidence=${threatResult.confidenceScore} reason="${threatResult.reason}"`
    );

    // Redact raw PII before database logging to guarantee zero data leakage into storage
    if (!zeroRetention) {
      const auditSafePrompt = entitiesFound > 0 ? redactForAuditLog(originalPrompt, tokenMap) : originalPrompt;
      try {
        await insertPromptLog({
          userId,
          originalPrompt: auditSafePrompt,
          maskedPrompt: maskedText,
          aiResponse: null,
          status: 'blocked',
          threatReason: `[${threatResult.category?.toUpperCase()}] ${threatResult.reason}`,
          piiEntitiesFound: entitiesFound,
        });
      } catch (logErr) {
        console.error('Log insert failed (blocked):', logErr.message);
      }
    }

    return res.status(200).json({
      status: 'blocked',
      response:
        '🚫 **Security Alert:** Your request has been blocked by the Aegis AI Firewall. ' +
        'It was identified as a potential security threat. This incident has been logged and will be reviewed by your IT administrator.',
      original_prompt: originalPrompt,
      masked_prompt: maskedText,
      threat_reason: `[${threatResult.category?.toUpperCase()}] ${threatResult.reason}`,
      threat_category: threatResult.category,
      confidence_score: threatResult.confidenceScore,
    });
  }

  // ── 4. Generate AI Response ──────────────────────────────────────
  let aiResponseRaw;
  try {
    aiResponseRaw = await generateResponse(maskedText);
  } catch (err) {
    const errMsg = err?.message ?? String(err);
    console.error('Generation error:', errMsg);
    return res.status(502).json({
      error: `AI service error: ${errMsg}`,
    });
  }

  // ── 5. Unmask PII in the AI Response ────────────────────────────
  const finalResponse = unmaskPII(aiResponseRaw, tokenMap);

  // Determine status: both PII masking AND soft threat warning upgrade to 'modified'
  const status = (entitiesFound > 0 || isSoftWarn) ? 'modified' : 'passed';
  const threatNote = isSoftWarn
    ? `[SOFT WARN – ${threatResult.category}] ${threatResult.reason}`
    : null;

  // ── 6. Log to Supabase (Zero Data Leakage: PII sanitized before storage) ──
  if (!zeroRetention) {
    const auditSafePrompt = entitiesFound > 0 ? redactForAuditLog(originalPrompt, tokenMap) : originalPrompt;
    try {
      await insertPromptLog({
        userId,
        originalPrompt: auditSafePrompt,
        maskedPrompt: maskedText,
        aiResponse: finalResponse,
        status,
        threatReason: threatNote,
        piiEntitiesFound: entitiesFound,
      });
    } catch (logErr) {
      console.error('Log insert failed (passed/modified):', logErr.message);
      // Don't fail the user — logging is best-effort
    }
  }

  return res.status(200).json({
    status,
    response: finalResponse,
    original_prompt: originalPrompt,
    masked_prompt: maskedText,
    pii_entities_found: entitiesFound,
    pii_breakdown: breakdown,
    ...(isSoftWarn && { threat_warning: threatResult.reason }),
  });
}

/**
 * Handle retrieving authenticated user's prompt history (scoped to user.id)
 */
export async function handleGetHistory(req, res) {
  try {
    const userId = req.user.id;
    const history = await getUserPromptHistory(userId);
    return res.status(200).json({ history });
  } catch (err) {
    console.error('Error fetching chat history:', err?.message || err);
    return res.status(500).json({ error: 'Failed to retrieve prompt history' });
  }
}

/**
 * Handle clearing all prompt history for the authenticated user from the database
 */
export async function handleClearHistory(req, res) {
  try {
    const userId = req.user.id;
    await clearUserPromptHistory(userId);
    return res.status(200).json({ success: true, message: 'All search and chat history wiped from database' });
  } catch (err) {
    console.error('Error clearing history:', err?.message || err);
    return res.status(500).json({ error: 'Failed to clear history' });
  }
}

/**
 * Handle deleting a single prompt history record
 */
export async function handleDeleteHistoryItem(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    await deleteSinglePromptHistory(userId, id);
    return res.status(200).json({ success: true, message: 'Record deleted from database' });
  } catch (err) {
    console.error('Error deleting history item:', err?.message || err);
    return res.status(500).json({ error: 'Failed to delete record' });
  }
}

