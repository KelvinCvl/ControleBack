const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ObservationService {
  async createObservation(speciesId, authorId, description, dangerLevel) {
    // Vérifier que la species existe
    const species = await prisma.species.findUnique({
      where: { id: parseInt(speciesId) }
    });

    if (!species) {
      throw new Error('Créature non trouvée');
    }

    // Vérifier que dangerLevel est entre 1 et 5
    if (dangerLevel < 1 || dangerLevel > 5) {
      throw new Error('dangerLevel doit être compris entre 1 et 5');
    }

    // Vérifier qu'il n'y a pas d'observation de la même espèce dans les 5 dernières minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const recentObservation = await prisma.observation.findFirst({
      where: {
        speciesId: parseInt(speciesId),
        authorId: parseInt(authorId),
        createdAt: {
          gte: fiveMinutesAgo
        }
      }
    });

    if (recentObservation) {
      throw new Error('Impossible de soumettre deux observations de la même espèce dans un délai de 5 minutes');
    }

    return await prisma.observation.create({
      data: {
        speciesId: parseInt(speciesId),
        authorId: parseInt(authorId),
        description,
        dangerLevel: parseInt(dangerLevel)
      }
    });
  }

  async getObservationsBySpecies(speciesId) {
    // Vérifier que la species existe
    const species = await prisma.species.findUnique({
      where: { id: parseInt(speciesId) }
    });

    if (!species) {
      throw new Error('Créature non trouvée');
    }

    return await prisma.observation.findMany({
      where: { speciesId: parseInt(speciesId) }
    });
  }

  async validateObservation(observationId, validatorId) {
    const observation = await prisma.observation.findUnique({
      where: { id: parseInt(observationId) }
    });

    if (!observation) {
      throw new Error('Observation non trouvée');
    }

    // Vérifier que le validateur n'est pas l'auteur
    if (observation.authorId === parseInt(validatorId)) {
      throw new Error('Impossible de valider sa propre observation');
    }

    return await prisma.observation.update({
      where: { id: parseInt(observationId) },
      data: {
        status: 'VALIDATED',
        validatedBy: parseInt(validatorId),
        validatedAt: new Date()
      }
    });
  }

  async rejectObservation(observationId, validatorId) {
    const observation = await prisma.observation.findUnique({
      where: { id: parseInt(observationId) }
    });

    if (!observation) {
      throw new Error('Observation non trouvée');
    }

    // Vérifier que le validateur n'est pas l'auteur
    if (observation.authorId === parseInt(validatorId)) {
      throw new Error('Impossible de rejeter sa propre observation');
    }

    return await prisma.observation.update({
      where: { id: parseInt(observationId) },
      data: {
        status: 'REJECTED',
        validatedBy: parseInt(validatorId),
        validatedAt: new Date()
      }
    });
  }
}

module.exports = new ObservationService();
