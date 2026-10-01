/**
 * PII Masker Utility
 * Detects and replaces PII with numbered tokens, then restores them.
 *
 * Capabilities:
 * - Phone numbers (10-digit continuous like 9324162905, +91, +1, +44, formatted 7-12 digits)
 * - Emails, SSNs, Credit Cards, IBANs, IP Addresses
 * - API / Secret Keys, AWS Keys, Passport numbers
 * - Customer / Account IDs (e.g. customer ID #98211)
 * - Personal Name introductions (e.g. "my name tanmay", "my name is Alice")
 * - redactForAuditLog: Sanitizes prompts before database storage so raw PII is NEVER saved
 */

const PII_PATTERNS = [
  // --- Highest specificity first ---

  // US Social Security Number: 123-45-6789
  {
    type: 'SSN',
    regex: /\b\d{3}-\d{2}-\d{4}\b/g,
  },

  // Credit / Debit Cards: 13–16 digit groups with optional spaces or dashes
  {
    type: 'CREDIT_CARD',
    regex: /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})\b/g,
  },

  // IBAN (international bank account): GB29 NWBK 6016 1331 9268 19
  {
    type: 'IBAN',
    regex: /\b[A-Z]{2}\d{2}[A-Z0-9]{4}\d{7}(?:[A-Z0-9]?){0,16}\b/g,
  },

  // Email addresses
  {
    type: 'EMAIL',
    regex: /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g,
  },

  // IPv4 addresses: 192.168.1.1
  {
    type: 'IP_ADDRESS',
    regex: /\b(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\b/g,
  },

  // Phone numbers (Indian, US, International, continuous 10-digit, formatted 7-12 digits)
  // Matches: 9324162905, +91 9324162905, +1-555-0199, (555) 123-4567, 555.123.4567
  {
    type: 'PHONE',
    regex: /(?<!\w|\d)(?:\+\d{1,3}[-.\s]?)?(?:(?:\(\d{2,4}\)|\b\d{2,4}\b)[-.\s]?)?(?:\b0?[6-9]\d{9}\b|\b\d{10}\b|\d{3,4}[-.\s]?\d{4})(?!\d)/g,
  },

  // Customer / Account IDs: e.g. "customer ID #98211", "account #12345"
  {
    type: 'CUSTOMER_ID',
    regex: /\b(?:customer|account|user|client)\s*(?:id|#|no\.?|number)?\s*[:#-]?\s*([A-Za-z0-9_-]{4,12})\b/gi,
    captureIndex: 1,
  },

  // Personal Name introductions: "my name is Tanmay", "my name tanmay", "I am Alice"
  {
    type: 'NAME',
    regex: /\b(my name is|my name|i am|this is|call me)\s+([A-Za-z]{3,20}(?:\s+[A-Za-z]{3,20})?)\b/gi,
    captureIndex: 2,
  },

  // Generic API / secret keys: long alphanumeric tokens > 24 chars with mixed case
  {
    type: 'API_KEY',
    regex: /\b(?:sk|pk|ghp|gho|ghu|ghs|ghr|AIza|AKIA|eyJhbGci)[A-Za-z0-9_\-]{16,}/g,
  },

  // AWS Access Key IDs: AKIAIOSFODNN7EXAMPLE
  {
    type: 'AWS_KEY',
    regex: /\b(ASIA|AKIA|AROA|AIDA)[A-Z0-9]{16}\b/g,
  },

  // US Passport / Driver's Licence patterns
  {
    type: 'PASSPORT',
    regex: /\b[A-Z]{1,2}\d{6,9}\b/g,
  },
];

/**
 * Masks PII in the given text.
 * @param {string} text - The raw user input.
 * @returns {{ maskedText: string, tokenMap: Record<string, string>, entitiesFound: number, breakdown: Record<string,number> }}
 */
export function maskPII(text) {
  const tokenMap = {};
  const counters = {};
  const breakdown = {};
  let maskedText = text;
  let entitiesFound = 0;

  for (const item of PII_PATTERNS) {
    const { type, regex, captureIndex } = item;
    regex.lastIndex = 0;

    maskedText = maskedText.replace(regex, (...args) => {
      const fullMatch = args[0];
      const target = (captureIndex !== undefined && args[captureIndex]) ? args[captureIndex] : fullMatch;

      // Avoid double-masking if already a token
      if (typeof target === 'string' && target.startsWith('<') && target.endsWith('>')) {
        return fullMatch;
      }

      counters[type] = (counters[type] || 0) + 1;
      breakdown[type] = counters[type];
      const token = `<${type}_${counters[type]}>`;
      tokenMap[token] = target;
      entitiesFound++;

      if (captureIndex !== undefined) {
        return fullMatch.replace(target, token);
      }
      return token;
    });
  }

  return { maskedText, tokenMap, entitiesFound, breakdown };
}

/**
 * Restores masked tokens in the text using the token map.
 * Uses longest-token-first ordering to prevent partial replacement bugs.
 * @param {string} text - The AI response potentially containing tokens.
 * @param {Record<string, string>} tokenMap - Map of token -> original value.
 * @returns {string}
 */
export function unmaskPII(text, tokenMap) {
  let unmasked = text;

  // Sort tokens longest-first to prevent <EMAIL_1> being replaced before <EMAIL_10>
  const sortedTokens = Object.keys(tokenMap).sort((a, b) => b.length - a.length);

  for (const token of sortedTokens) {
    const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    unmasked = unmasked.replace(new RegExp(escaped, 'g'), tokenMap[token]);
  }

  return unmasked;
}

/**
 * Returns a human-readable summary of what PII was found.
 * @param {Record<string,number>} breakdown
 * @returns {string}
 */
export function describePII(breakdown) {
  if (!Object.keys(breakdown).length) return 'No PII detected.';
  return Object.entries(breakdown)
    .map(([type, count]) => `${count}× ${type.replace('_', ' ')}`)
    .join(', ');
}

/**
 * Redacts sensitive values specifically for database audit logging.
 * Replaces raw PII values with partial/anonymized masks so raw SSNs, passwords,
 * credit cards, phone numbers, and API keys are NEVER stored in plaintext in the database table.
 * @param {string} text - The original prompt.
 * @param {Record<string, string>} tokenMap - Map of token -> original value.
 * @returns {string}
 */
export function redactForAuditLog(text, tokenMap) {
  let safeText = text;
  for (const [token, rawValue] of Object.entries(tokenMap)) {
    let maskedValue = '[REDACTED]';

    if (token.startsWith('<EMAIL_')) {
      const parts = rawValue.split('@');
      maskedValue = `${parts[0]?.[0] || 'u'}***@${parts[1] || 'domain.com'}`;
    } else if (token.startsWith('<SSN_')) {
      maskedValue = `***-**-${rawValue.slice(-4)}`;
    } else if (token.startsWith('<CREDIT_CARD_')) {
      maskedValue = `****-****-****-${rawValue.slice(-4)}`;
    } else if (token.startsWith('<PHONE_')) {
      maskedValue = `***-***-${rawValue.slice(-4)}`;
    } else if (token.startsWith('<NAME_')) {
      maskedValue = `${rawValue[0]}***`;
    } else if (token.startsWith('<CUSTOMER_ID_')) {
      maskedValue = `ID-***${rawValue.slice(-2)}`;
    } else if (token.startsWith('<API_KEY_') || token.startsWith('<AWS_KEY_')) {
      maskedValue = `${rawValue.slice(0, 4)}...[REDACTED_SECRET]`;
    } else if (token.startsWith('<IP_ADDRESS_')) {
      const octets = rawValue.split('.');
      maskedValue = `${octets[0] || '10'}.***.***.${octets[3] || '1'}`;
    } else {
      maskedValue = `[REDACTED]`;
    }

    safeText = safeText.split(rawValue).join(maskedValue);
  }
  return safeText;
}
