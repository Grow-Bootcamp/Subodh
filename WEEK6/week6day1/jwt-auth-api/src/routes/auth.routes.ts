import { Router } from 'express';
import { login } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { loginSchema } from '../schemas/auth.schema';

const router = Router();

/**
 * POST /api/auth/login
 * Body: { "email": "user@example.com", "password": "password123" }
 */
router.post('/login', validate(loginSchema), login);

export default router;
