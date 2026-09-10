import { Router } from 'express';
import { analyticsService } from './analytics.service';
import { sendResponse, sendError } from '../../utils/apiResponse';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const analytics = await analyticsService.getAnalyticsSummary();
    sendResponse(res, analytics);
  } catch (err: any) {
    sendError(res, err.message);
  }
});

export default router;
