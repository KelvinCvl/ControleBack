const express = require("express");
const router = express.Router();
const taxonomyController = require("../controllers/taxonomyController");

/**
 * @swagger
 * /taxonomy/stats:
 *   get:
 *     summary: Retourne les statistiques globales sur les espèces et observations
 *     tags: [Taxonomy]
 *     responses:
 *       200:
 *         description: Statistiques générées avec succès
 *       500:
 *         description: Erreur serveur
 */
router.get("/stats", taxonomyController.getStats);

module.exports = router;
