import { updateReputationFromObservation } from '../services/webhookServices.js';

export const webhookObservationValidatedController = async (req, res) => {
  try {
    const {
      authorId,
      validatorId,
      approved,
      giveBonusToValidator = false
    } = req.body;

    if (!authorId || !validatorId || typeof approved !== 'boolean') {
      return res.status(400).json({ error: 'Données manquantes ou invalides' });
    }

    await updateReputationFromObservation({
      authorId: Number(authorId),
      validatorId: Number(validatorId),
      approved,
      giveBonusToValidator
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Webhook observation-validated échoué:', error);
    res.status(500).json({ error: 'Erreur interne serveur' });
  }
};