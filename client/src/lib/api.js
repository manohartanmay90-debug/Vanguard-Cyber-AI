const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * Send a chat prompt to the Aegis AI backend.
 * @param {string} prompt
 * @param {string} accessToken - Supabase JWT
 */
export async function sendChatPrompt(prompt, accessToken, zeroRetention = false) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ prompt, zeroRetention }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to send prompt');
  }
  return data;
}

/**
 * Fetch authenticated user's prompt history.
 * @param {string} accessToken
 */
export async function fetchUserHistory(accessToken) {
  const res = await fetch(`${API_BASE}/chat/history`, {
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
  const res = await fetch(`${API_BASE}/chat/history`, {
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
  const res = await fetch(`${API_BASE}/chat/history/${recordId}`, {
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
  const res = await fetch(`${API_BASE}/admin/logs`, {
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
  const res = await fetch(`${API_BASE}/admin/stats`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch stats');
  return data.stats;
}
