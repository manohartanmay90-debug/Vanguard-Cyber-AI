import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  handleChat,
  handleGetHistory,
  handleClearHistory,
  handleDeleteHistoryItem
} from '../controllers/chatController.js';

const router = Router();

router.post('/', requireAuth, handleChat);
router.get('/history', requireAuth, handleGetHistory);
router.delete('/history', requireAuth, handleClearHistory);
router.delete('/history/:id', requireAuth, handleDeleteHistoryItem);

export default router;
