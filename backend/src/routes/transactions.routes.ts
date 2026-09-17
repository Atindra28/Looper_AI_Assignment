import { Router } from 'express';
import { getTransactions, getTransactionById, exportTransactions } from '../controllers/transactions.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All transaction routes are protected
router.use(authenticate as any);

// GET /api/transactions
router.get('/', getTransactions as any);

// POST /api/transactions/export — must be before /:id to avoid route conflict
router.post('/export', exportTransactions as any);

// GET /api/transactions/:id
router.get('/:id', getTransactionById as any);

export default router;
