import { getAllLogs, getAdminStats } from '../utils/supabase.js';

export async function handleGetLogs(req, res) {
  try {
    const logs = await getAllLogs();
    return res.status(200).json({ logs });
  } catch (err) {
    console.error('Failed to fetch logs:', err);
    return res.status(500).json({ error: 'Failed to retrieve logs' });
  }
}

export async function handleGetStats(req, res) {
  try {
    const stats = await getAdminStats();
    return res.status(200).json({ stats });
  } catch (err) {
    console.error('Failed to fetch stats:', err);
    return res.status(500).json({ error: 'Failed to retrieve stats' });
  }
}
