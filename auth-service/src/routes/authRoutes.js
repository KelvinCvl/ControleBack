import { Router } from 'express';
import { register, login, getMe, getAllUsers, updateUserRole } from '../controllers/auth.controller.js';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';

const router = Router();

// Publiques
router.post('/register', register);
router.post('/login',    login);

// Protégées
router.get('/me',               protect,                    getMe);
router.get('/admin/users',      protect, adminOnly,         getAllUsers);
router.patch('/users/:id/role', protect, adminOnly,         updateUserRole);

export default router;