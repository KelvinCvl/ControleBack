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
      data: { name, authorId }
    });
  }

  async getAllSpecies() {
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
}

module.exports = new SpeciesService();
