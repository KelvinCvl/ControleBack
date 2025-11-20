const speciesService = require('../services/speciesService');

class SpeciesController {
  async createSpecies(req, res) {
    try {
      const { name } = req.body;
      const authorId = req.user.id;

      if (!name) {
        return res.status(400).json({ error: 'name est obligatoire' });
      }

      const species = await speciesService.createSpecies(name, authorId);
      res.status(201).json(species);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllSpecies(req, res) {
    try {
      const species = await speciesService.getAllSpecies();
      res.json(species);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getSpeciesById(req, res) {
    try {
      const { id } = req.params;
      const species = await speciesService.getSpeciesById(id);
      res.json(species);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = new SpeciesController();
