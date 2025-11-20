const { PrismaClient } = require('@prisma/client');
const axios = require('axios');

const prisma = new PrismaClient();
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:4000';

class ObservationService {

  async createObservation(speciesId, authorId, description, dangerLevel) {
    const species = await prisma.species.findUnique({
      where: { id: parseInt(speciesId) }
    });

    if (!species) throw new Error('Créature non trouvée');
    if (dangerLevel < 1 || dangerLevel > 5) {
      throw new Error('dangerLevel doit être compris entre 1 et 5');
    }

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const recent = await prisma.observation.findFirst({
      where: {
        speciesId: parseInt(speciesId),
        authorId: parseInt(authorId),
        createdAt: { gte: fiveMinutesAgo }
      }
    });

    if (recent) {
      throw new Error('Impossible de soumettre deux observations de la même espèce dans un délai de 5 minutes');
    }

    return await prisma.observation.create({
      data: {
        speciesId: parseInt(speciesId),
        authorId: parseInt(authorId),
        description,
        dangerLevel: parseInt(dangerLevel),
        status: 'PENDING' 
      }
    });
  }

  async getObservationsBySpecies(speciesId) {
    const species = await prisma.species.findUnique({ where: { id: parseInt(speciesId) } });
    if (!species) throw new Error('Créature non trouvée');

    return await prisma.observation.findMany({
      where: { speciesId: parseInt(speciesId) }
    });
  }

  async validateObservation(observationId, validatorId, validatorRole = 'USER') {
    const observation = await prisma.observation.findUnique({
      where: { id: parseInt(observationId) }
    });

    if (!observation) throw new Error('Observation non trouvée');
    if (observation.status !== 'PENDING') throw new Error('Cette observation a déjà été traitée');
    if (observation.authorId === parseInt(validatorId)) {
      throw new Error('Impossible de valider sa propre observation');
    }

<<<<<<< HEAD
    const validatedObservation = await prisma.observation.update({
=======
    const updated = await prisma.observation.update({
>>>>>>> feature/validationrejet
      where: { id: parseInt(observationId) },
      data: {
        status: 'VALIDATED',
        validatedBy: parseInt(validatorId),
        validatedAt: new Date()
      }
    });

<<<<<<< HEAD
    // Mettre à jour le score de rareté de l'espèce
    const speciesService = require('./speciesService');
    await speciesService.updateRarityScore(observation.speciesId);

    return validatedObservation;
=======
    const giveBonusToValidator = validatorRole === 'EXPERT';

    axios.post(`${USER_SERVICE_URL}/webhook/observation-validated`, {
      observationId: updated.id,
      authorId: observation.authorId,
      validatorId: parseInt(validatorId),
      approved: true,
      giveBonusToValidator
    }).catch(() => console.warn('Users-service injoignable – réputation non mise à jour'));

    return updated;
>>>>>>> feature/validationrejet
  }

  async rejectObservation(observationId, validatorId, validatorRole = 'USER') {
    const observation = await prisma.observation.findUnique({
      where: { id: parseInt(observationId) }
    });

    if (!observation) throw new Error('Observation non trouvée');
    if (observation.status !== 'PENDING') throw new Error('Cette observation a déjà été traitée');
    if (observation.authorId === parseInt(validatorId)) {
      throw new Error('Impossible de rejeter sa propre observation');
    }

    const updated = await prisma.observation.update({
      where: { id: parseInt(observationId) },
      data: {
        status: 'REJECTED',
        validatedBy: parseInt(validatorId),
        validatedAt: new Date()
      }
    });

    axios.post(`${USER_SERVICE_URL}/webhook/observation-validated`, {
      observationId: updated.id,
      authorId: observation.authorId,
      validatorId: parseInt(validatorId),
      approved: false,
      giveBonusToValidator: false 
    }).catch(() => console.warn('Users-service injoignable – réputation non mise à jour'));

    return updated;
  }
}

module.exports = new ObservationService();