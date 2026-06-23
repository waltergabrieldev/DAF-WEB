import express from 'express';
import { createHistory, deleteHistoryItem, listHistory } from '../controllers/historyController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', listHistory);
router.post('/', createHistory);
router.delete('/:id', deleteHistoryItem);

export default router;
