const express = require('express');
const router = express.Router();
const speciesController = require('../controllers/speciesController');
const observationController = require('../controllers/observationController');
const { verifyJWT } = require('../middlewares/auth');

/**
 * @swagger
 * /species:
 *   post:
 *     summary: Créer une nouvelle créature
 *     tags: [Species]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "KRAKEN"
 *     responses:
 *       201:
 *         description: Créature créée avec succès
 *       400:
 *         description: Erreur - données manquantes ou créature existante
 */
router.post('/', verifyJWT, (req, res) => speciesController.createSpecies(req, res));

/**
 * @swagger
 * /species:
 *   get:
 *     summary: Voir toutes les créatures
 *     tags: [Species]
 *     responses:
 *       200:
 *         description: Liste de toutes les créatures
 */
router.get('/', (req, res) => speciesController.getAllSpecies(req, res));

/**
 * @swagger
 * /species/{id}:
 *   get:
 *     summary: Voir une créature spécifique
 *     tags: [Species]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la créature
 *     responses:
 *       200:
 *         description: Créature trouvée
 *       404:
 *         description: Créature non trouvée
 */
router.get('/:id', (req, res) => speciesController.getSpeciesById(req, res));

/**
 * @swagger
 * /species/{id}/observations:
 *   get:
 *     summary: Voir les observations d'une créature
 *     tags: [Observations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la créature
 *     responses:
 *       200:
 *         description: Liste des observations
 *       404:
 *         description: Créature non trouvée
 */
router.get('/:id/observations', (req, res) => 
  observationController.getObservationsBySpecies(req, res)
);

module.exports = router;
