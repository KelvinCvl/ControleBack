const express = require('express');
const router = express.Router();
const observationController = require('../controllers/observationController');
const { verifyJWT, verifyExpertOrAdmin } = require('../middlewares/auth');

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

module.exports = router;
