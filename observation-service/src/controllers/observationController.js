const observationService = require('../services/observationService');

class ObservationController {

  async getAllObservations(req, res) {
  try {
    const observations = await observationService.getAllObservations();
    res.json(observations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

  async createObservation(req, res) {
    try {
      const { speciesId, description, dangerLevel } = req.body;
      const authorId = req.user.userId;

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
      const validatorId = req.user.userId || req.user.id;
      const validatorRole = req.user.role || 'USER';

      const observation = await observationService.validateObservation(
        id,
        validatorId,
        validatorRole
      );

      res.json({ success: true, observation });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async rejectObservation(req, res) {
    try {
      const { id } = req.params;
      const validatorId = req.user.userId || req.user.id;
      const validatorRole = req.user.role || 'USER';

      const observation = await observationService.rejectObservation(
        id,
        validatorId,
        validatorRole
      );

      res.json({ success: true, observation });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

   async softDeleteObservation(req, res) {
    try {
      const obs = await observationService.softDeleteObservation(req.params.id, req.user.id);
      res.json(obs);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async restoreObservation(req, res) {
    try {
      const obs = await observationService.restoreObservation(req.params.id, req.user.id);
      res.json(obs);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async getUserHistory(req, res) {
    try {
      const history = await observationService.getUserHistory(req.params.id);
      res.json(history);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async getSpeciesHistory(req, res) {
    try {
      const history = await observationService.getSpeciesHistory(req.params.id);
      res.json(history);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = new ObservationController();
