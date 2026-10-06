import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

import { createClient } from '@supabase/supabase-js';

const DEFAULT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtnd2hyZnRlbnRoZHRvZWZmaGZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4Mjc2MjksImV4cCI6MjEwNjQwMzYyOX0.PY3kEGG3fKsxfFVS_8rcxBUpxJSzBlNY-9HaV06_Xjc';
const supabaseUrl = process.env.SUPABASE_URL || 'https://kgwhrftenthdtoeffhfa.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || DEFAULT_ANON_KEY;

// Service-role client bypasses RLS for admin operations
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

/**
 * Verify a Supabase JWT and return the authenticated user.
 * @param {string} token - Bearer token from Authorization header.
 * @returns {Promise<import('@supabase/supabase-js').User>}
 */
export async function verifyToken(token) {
  if (!token) throw new Error('Missing token');

  // 1. Try with supabaseAdmin client
  try {
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (!error && data?.user) {
      return data.user;
    }
  } catch (err) {
    console.warn('supabaseAdmin.auth.getUser error:', err?.message);
  }

  // 2. Fallback: verify using fresh client with bearer token header
  try {
    const client = createClient(supabaseUrl, DEFAULT_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data, error } = await client.auth.getUser(token);
    if (!error && data?.user) {
      return data.user;
    }
  } catch (fallbackErr) {
    console.warn('Fallback token verify error:', fallbackErr?.message);
  }

  throw new Error('Invalid or expired token');
}

/**
 * Get the profile (role, email) for a given user ID.
 * @param {string} userId
 */
export async function getUserProfile(userId) {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('id, role, email')
    .eq('id', userId)
    .single();

  if (error) throw new Error('Profile not found');
  return data;
}

/**
 * Insert a prompt log entry.
 */
export async function insertPromptLog({
  userId,
  originalPrompt,
  maskedPrompt,
  aiResponse,
  status,
  threatReason,
  piiEntitiesFound,
}) {
  // Proactively ensure profile exists to satisfy foreign key constraint prompts_log_user_id_fkey
  try {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    if (!profile) {
      const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(userId);
      await supabaseAdmin.from('profiles').upsert({
        id: userId,
        email: authUser?.user?.email || 'user@vanguardcyber.ai',
        role: 'employee',
      });
    }
  } catch (err) {
    console.warn('Profile ensure check warning:', err?.message);
  }

  const { error } = await supabaseAdmin.from('prompts_log').insert({
    user_id: userId,
    original_prompt: originalPrompt,
    masked_prompt: maskedPrompt,
    ai_response: aiResponse,
    status,
    threat_reason: threatReason,
    pii_entities_found: piiEntitiesFound,
  });

  if (error) {
    console.error('Failed to insert log:', error.message);
    throw error;
  }
}

/**
 * Fetch prompt history for a specific user (scoped strictly to user_id for security & trust).
 * @param {string} userId
 * @param {number} [limit=100]
 */
export async function getUserPromptHistory(userId, limit = 100) {
  const { data, error } = await supabaseAdmin
    .from('prompts_log')
    .select(`
      id,
      original_prompt,
      masked_prompt,
      ai_response,
      status,
      threat_reason,
      pii_entities_found,
      created_at
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Failed to get user history:', error.message);
    throw error;
  }
  return data || [];
}

/**
 * Delete all prompt history for a specific user from the database.
 * @param {string} userId
 */
export async function clearUserPromptHistory(userId) {
  const { error } = await supabaseAdmin
    .from('prompts_log')
    .delete()
    .eq('user_id', userId);

  if (error) {
    console.error('Failed to clear user history:', error.message);
    throw error;
  }
  return true;
}

/**
 * Delete a single prompt history record for a specific user.
 * @param {string} userId
 * @param {string} recordId
 */
export async function deleteSinglePromptHistory(userId, recordId) {
  const { error } = await supabaseAdmin
    .from('prompts_log')
    .delete()
    .eq('id', recordId)
    .eq('user_id', userId);

  if (error) {
    console.error('Failed to delete history record:', error.message);
    throw error;
  }
  return true;
}

/**
 * Fetch all prompt logs (admin only).
 */
export async function getAllLogs() {
  const { data, error } = await supabaseAdmin
    .from('prompts_log')
    .select(`
      id,
      user_id,
      original_prompt,
      masked_prompt,
      ai_response,
      status,
      threat_reason,
      pii_entities_found,
      created_at,
      profiles(email, role)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Fetch aggregated stats for the admin dashboard.
 */
export async function getAdminStats() {
  const { data, error } = await supabaseAdmin
    .from('prompts_log')
    .select('status, pii_entities_found');

  if (error) throw error;

  const stats = {
    total: data.length,
    blocked: data.filter(r => r.status === 'blocked').length,
    modified: data.filter(r => r.status === 'modified').length,
    passed: data.filter(r => r.status === 'passed').length,
    totalPiiMasked: data.reduce((sum, r) => sum + (r.pii_entities_found || 0), 0),
  };

  return stats;
}
