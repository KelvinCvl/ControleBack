const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class SpeciesService {
  async createSpecies(name, authorId) {
    // Vérifier que la species n'existe pas déjà
    const existing = await prisma.species.findUnique({
      where: { name }
    });

    if (existing) {
      throw new Error('Cette créature existe déjà');
    }

    return await prisma.species.create({
      data: { name, authorId, rarityScore: 1.0 }
    });
  }

  async getAllSpecies(sortByRarity = false) {
    if (sortByRarity) {
      // Trier par rareté (décroissant - les plus rares en premier)
      return await prisma.species.findMany({
        orderBy: { rarityScore: 'desc' }
      });
    }
    return await prisma.species.findMany();
  }

  async getSpeciesById(id) {
    const species = await prisma.species.findUnique({
      where: { id: parseInt(id) }
    });

    if (!species) {
      throw new Error('Créature non trouvée');
    }

    return species;
  }

  // Calculer la rareté d'une espèce basée sur ses observations validées
  async updateRarityScore(speciesId) {
    // Compter les observations validées pour cette espèce
    const validatedCount = await prisma.observation.count({
      where: {
        speciesId: parseInt(speciesId),
        status: 'VALIDATED'
      }
    });

    // Formule: rarityScore = 1 + (nombreObservationsValidées / 5)
    const newRarityScore = 1 + (validatedCount / 5);

    // Mettre à jour la rareté
    return await prisma.species.update({
      where: { id: parseInt(speciesId) },
      data: { rarityScore: newRarityScore }
    });
  }
}

module.exports = new SpeciesService();
