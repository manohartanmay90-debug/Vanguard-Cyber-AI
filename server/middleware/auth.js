import { verifyToken, getUserProfile } from '../utils/supabase.js';

/**
 * Middleware: authenticate any logged-in user.
 */
export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing authorization header' });
  }

  const token = authHeader.slice(7);
  try {
    const user = await verifyToken(token);
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/**
 * Middleware: authenticate and verify admin role.
 */
export async function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing authorization header' });
  }

  const token = authHeader.slice(7);
  try {
    const user = await verifyToken(token);
    const profile = await getUserProfile(user.id);

    if (profile.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    req.user = user;
    req.profile = profile;
    next();
  } catch (err) {
    return res.status(401).json({ error: err.message || 'Authentication failed' });
  }
}
