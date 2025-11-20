import { Router } from 'express';
import { webhookObservationValidatedController } from '../controllers/webhookController.js';

const router = Router();

router.post('/observation-validated', webhookObservationValidatedController);

export default router;