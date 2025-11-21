const { PrismaClient } = require("@prisma/client");
const fetchData = require("./fetchdata");

const prisma = new PrismaClient();

class TaxonomyService {
  async generateStats() {
    const { species, observations } = await fetchData();

    const stats = {
      nombreEspeces: species.length,
      nombreObservations: observations.length,
      observationsParEspece: {},
      moyenneObservationsParEspece: 0
    };

    species.forEach((sp) => {
      const count = observations.filter((o) => o.speciesId === sp.id).length;
      stats.observationsParEspece[sp.name] = count;
    });

    if (species.length > 0) {
      stats.moyenneObservationsParEspece =
        observations.length / species.length;
    }

    await prisma.stats.create({
      data: {
        totalSpecies: stats.nombreEspeces,
        totalObservations: stats.nombreObservations,
        averagePerSpecies: stats.moyenneObservationsParEspece
      }
    });

    return stats;
  }
}

module.exports = new TaxonomyService();
