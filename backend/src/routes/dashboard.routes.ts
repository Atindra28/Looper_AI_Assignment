import { Router } from 'express';
import { getSummary, getTrends, getCategories, getRecentTransactions } from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All dashboard routes are protected
router.use(authenticate as any);

router.get('/summary', getSummary as any);
router.get('/trends', getTrends as any);
router.get('/categories', getCategories as any);
router.get('/recent', getRecentTransactions as any);

export default router;
