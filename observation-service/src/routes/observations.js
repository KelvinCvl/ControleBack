const express = require('express');
const router = express.Router();
const observationController = require('../controllers/observationController');
const { verifyJWT, verifyExpertOrAdmin } = require('../middlewares/auth');

/**
 * @swagger
 * /observations/get:
 *   get:
 *     summary: Récupérer toutes les observations
 *     tags: [Observations]
 *     responses:
 *       200:
 *         description: Liste de toutes les observations
 */
router.get('/get', (req, res) => observationController.getAllObservations(req, res));

/**
 * @swagger
 * /observations:
 *   post:
 *     summary: Créer une observation
 *     tags: [Observations]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               speciesId:
 *                 type: integer
 *                 example: 1
 *               description:
 *                 type: string
 *                 example: "J'ai vu un kraken"
 *               dangerLevel:
 *                 type: integer
 *                 example: 4
 *     responses:
 *       201:
 *         description: Observation créée
 *       400:
 *         description: Erreur - données manquantes ou règle métier
 *       404:
 *         description: Créature non trouvée
 */
router.post('/', verifyJWT, (req, res) => observationController.createObservation(req, res));

/**
 * @swagger
 * /observations/{id}/validate:
 *   post:
 *     summary: Valider une observation (EXPERT/ADMIN only)
 *     tags: [Observations]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'observation
 *     responses:
 *       200:
 *         description: Observation validée
 *       400:
 *         description: Erreur - ne peut pas valider sa propre observation
 *       403:
 *         description: Accès refusé - rôle insuffisant
 *       404:
 *         description: Observation non trouvée
 */
router.post('/:id/validate', verifyJWT, (req, res) => 
  observationController.validateObservation(req, res)
);

/**
 * @swagger
 * /observations/{id}/reject:
 *   post:
 *     summary: Rejeter une observation (EXPERT/ADMIN only)
 *     tags: [Observations]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'observation
 *     responses:
 *       200:
 *         description: Observation rejetée
 *       400:
 *         description: Erreur - ne peut pas rejeter sa propre observation
 *       403:
 *         description: Accès refusé - rôle insuffisant
 *       404:
 *         description: Observation non trouvée
 */
router.post('/:id/reject', verifyJWT, (req, res) => 
  observationController.rejectObservation(req, res)
);

/**
 * @swagger
 * /observations/{id}:
 *   delete:
 *     summary: Supprimer une observation (soft delete) (ADMIN/EXPERT only)
 *     tags: [Observations]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'observation à supprimer
 *     responses:
 *       200:
 *         description: Observation supprimée (soft delete)
 *       403:
 *         description: Accès refusé - rôle insuffisant
 *       404:
 *         description: Observation non trouvée
 */
router.delete("/:id", verifyJWT, verifyExpertOrAdmin, (req, res) =>
  observationController.softDeleteObservation(req, res)
);

/**
 * @swagger
 * /observations/{id}/restore:
 *   post:
 *     summary: Restaurer une observation supprimée (ADMIN only)
 *     tags: [Observations]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'observation à restaurer
 *     responses:
 *       200:
 *         description: Observation restaurée
 *       403:
 *         description: Accès refusé - rôle insuffisant
 *       404:
 *         description: Observation non trouvée ou non supprimée
 */
router.post("/:id/restore", verifyJWT, verifyExpertOrAdmin, (req, res) =>
  observationController.restoreObservation(req, res)
);

/**
 * @swagger
 * /admin/user/{id}/history:
 *   get:
 *     summary: Récupérer l'historique des actions d'un utilisateur (ADMIN/EXPERT)
 *     tags: [Observations]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Historique récupéré
 *       403:
 *         description: Accès refusé - rôle insuffisant
 *       404:
 *         description: Historique non trouvé
 */
router.get("/admin/user/:id/history", verifyJWT, verifyExpertOrAdmin, (req, res) =>
  observationController.getUserHistory(req, res)
);

/**
 * @swagger
 * /expert/species/{id}/history:
 *   get:
 *     summary: Récupérer l'historique d'une espèce (EXPERT/ADMIN)
 *     tags: [Observations]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'espèce
 *     responses:
 *       200:
 *         description: Historique récupéré
 *       403:
 *         description: Accès refusé - rôle insuffisant
 *       404:
 *         description: Historique non trouvé
 */
router.get("/expert/species/:id/history", verifyJWT, verifyExpertOrAdmin, (req, res) =>
  observationController.getSpeciesHistory(req, res)
);

module.exports = router;
