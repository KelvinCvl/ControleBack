const axios = require("axios");

const OBSERVATION_SERVICE_URL = process.env.OBSERVATION_SERVICE_URL || "http://localhost:3002";

async function fetchData() {
  try {
    const speciesResp = await axios.get(`${OBSERVATION_SERVICE_URL}/species`);
    const species = speciesResp.data;

    const observationsResp = await axios.get(`${OBSERVATION_SERVICE_URL}/observations/get`);
    const observations = observationsResp.data;

    return { species, observations };
  } catch (err) {
    console.error("Erreur fetchData :", err.message);
    return { species: [], observations: [] };
  }
}

module.exports = fetchData;
