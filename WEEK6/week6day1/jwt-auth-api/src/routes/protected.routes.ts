import { Router } from 'express';
import { getProfile } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * GET /api/protected/profile
 * Header: Authorization: Bearer <JWT>
 */
router.get('/profile', authenticate, getProfile);

export default router;
