import { Router } from 'express';
import { requireAdmin } from '../middleware/auth.js';
import { handleGetLogs, handleGetStats } from '../controllers/adminController.js';

const router = Router();

// All admin routes require admin role
router.get('/logs', requireAdmin, handleGetLogs);
router.get('/stats', requireAdmin, handleGetStats);

export default router;
