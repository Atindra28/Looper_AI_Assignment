import { Router } from 'express';
import { login, logout, getMe } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// POST /api/auth/login
router.post('/login', login as any);

// POST /api/auth/logout (protected — requires valid token)
router.post('/logout', authenticate as any, logout as any);

// GET /api/auth/me (protected)
router.get('/me', authenticate as any, getMe as any);

export default router;
