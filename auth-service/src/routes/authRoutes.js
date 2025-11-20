import { Router } from 'express';
import { register, login, getMe, getAllUsersController, updateUserRoleController } from '../controllers/authController.js';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';

const router = Router();

// Publiques
router.post('/register', register);
router.post('/login',    login);

// Protégées
router.get('/me',               protect,                    getMe);
router.get('/admin/users',      protect, adminOnly,         getAllUsersController);
router.patch('/users/:id/role', protect, adminOnly,         updateUserRoleController);

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Routes d'authentification et gestion des utilisateurs
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Enregistrer un nouvel utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilisateur créé
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connecter un utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie
 */
/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Obtenir les informations de l'utilisateur connecté
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Infos utilisateur récupérées
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 email:
 *                   type: string
 *                 username:
 *                   type: string
 *                 role:
 *                   type: string
 *                 reputation:
 *                   type: integer
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 */
/**
 * @swagger
 * /auth/admin/users:
 *   get:
 *     summary: Récupérer tous les utilisateurs (admin uniquement)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   email:
 *                     type: string
 *                   username:
 *                     type: string
 *                   role:
 *                     type: string
 *                   reputation:
 *                     type: integer
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé pour non-admin
 */
/**
 * @swagger
 * /auth/users/{id}/role:
 *   patch:
 *     summary: Modifier le rôle d'un utilisateur (admin uniquement)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [USER, EXPERT, ADMIN]
 *     responses:
 *       200:
 *         description: Rôle modifié avec succès
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé pour non-admin
 *       404:
 *         description: Utilisateur non trouvé
 */


export default router;