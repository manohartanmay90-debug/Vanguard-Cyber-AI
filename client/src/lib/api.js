/**
 * Dynamic API Base resolution:
 * - On HTTPS (e.g. Vercel production), securely uses relative '/api' to avoid Mixed Content errors.
 * - On localhost in local development, uses 'http://localhost:3000/api' if not explicitly configured.
 */
export function getApiBase() {
  const envUrl = import.meta.env.VITE_API_BASE_URL;

  if (typeof window !== 'undefined') {
    // 1. If running on HTTPS (production Vercel)
    if (window.location.protocol === 'https:') {
      // Insecure http:// backend would cause Mixed Content block, so use same-origin /api
      if (!envUrl || envUrl.startsWith('http://') || envUrl === '/api') {
        return '/api';
      }
      return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
    }

    // 2. If running locally on localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      if (!envUrl || envUrl === '/api') {
        return 'http://localhost:3000/api';
      }
      return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
    }
  }

  return envUrl || '/api';
}

/**
 * Send a chat prompt to the Vanguard Cyber AI backend.
 * @param {string} prompt
 * @param {string} accessToken - Supabase JWT
 */
export async function sendChatPrompt(prompt, accessToken, zeroRetention = false) {
  const apiBase = getApiBase();
  const url = `${apiBase}/chat`;
  
  let res;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ prompt, zeroRetention }),
    });
  } catch (err) {
    console.error(`Network Error fetching ${url}:`, err);
    throw new Error(`Network Error: ${err.message}. (Attempted URL: ${url})`);
  }

  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const text = await res.text();
    console.error('Server returned non-JSON:', text.slice(0, 150));
    throw new Error(`Server returned HTML/Text (status ${res.status}). Ensure API is reachable. URL: ${url}`);
  }

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `HTTP ${res.status} error from server`);
  }
  return data;
}

/**
 * Fetch authenticated user's prompt history.
 * @param {string} accessToken
 */
export async function fetchUserHistory(accessToken) {
  const apiBase = getApiBase();
  const res = await fetch(`${apiBase}/chat/history`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch history');
  return data.history || [];
}

/**
 * Clear all user prompt history from the database.
 * @param {string} accessToken
 */
export async function clearAllUserHistory(accessToken) {
  const apiBase = getApiBase();
  const res = await fetch(`${apiBase}/chat/history`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to clear history');
  return data;
}

/**
 * Delete a single prompt history record.
 * @param {string} recordId
 * @param {string} accessToken
 */
export async function deleteHistoryRecord(recordId, accessToken) {
  const apiBase = getApiBase();
  const res = await fetch(`${apiBase}/chat/history/${recordId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete record');
  return data;
}

/**
 * Fetch admin audit logs.
 */
export async function fetchAdminLogs(accessToken) {
  const apiBase = getApiBase();
  const res = await fetch(`${apiBase}/admin/logs`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch logs');
  return data.logs;
}

/**
 * Fetch admin KPI stats.
 */
export async function fetchAdminStats(accessToken) {
  const apiBase = getApiBase();
  const res = await fetch(`${apiBase}/admin/stats`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch stats');
  return data.stats;
}

