import { Router } from 'express';
import { sendResponse } from '../../utils/apiResponse';
import { ENV } from '../../config/env';

const router = Router();

/**
 * GET /api/health
 * Health check endpoint.
 */
router.get('/', (req, res) => {
  return sendResponse(res, {
    status: 'ok',
    service: 'Jharkhand Societal Innovation Portal API',
    aiConfigured: Boolean(ENV.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

export default router;
