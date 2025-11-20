const observationService = require('../services/observationService');

class ObservationController {
  async createObservation(req, res) {
    try {
      const { speciesId, description, dangerLevel } = req.body;
      const authorId = req.user.id;

      if (!speciesId || !description || dangerLevel === undefined) {
        return res.status(400).json({ 
          error: 'speciesId, description et dangerLevel sont obligatoires' 
        });
      }

      const observation = await observationService.createObservation(
        speciesId,
        authorId,
        description,
        dangerLevel
      );

      res.status(201).json(observation);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getObservationsBySpecies(req, res) {
    try {
      const { id } = req.params;
      const observations = await observationService.getObservationsBySpecies(id);
      res.json(observations);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async validateObservation(req, res) {
    try {
      const { id } = req.params;
      const validatorId = req.user.id;

      const observation = await observationService.validateObservation(id, validatorId);
      res.json(observation);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async rejectObservation(req, res) {
    try {
      const { id } = req.params;
      const validatorId = req.user.id;

      const observation = await observationService.rejectObservation(id, validatorId);
      res.json(observation);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new ObservationController();
