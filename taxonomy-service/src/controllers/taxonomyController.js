const taxonomyService = require("../services/taxonomyService");

class TaxonomyController {
  async getStats(req, res) {
    try {
      const stats = await taxonomyService.generateStats();
      res.json(stats);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new TaxonomyController();
