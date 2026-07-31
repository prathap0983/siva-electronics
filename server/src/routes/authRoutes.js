import express from 'express';
import { login, getMe, logout } from '../controllers/authController.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', requireAdmin, getMe);

export default router;
