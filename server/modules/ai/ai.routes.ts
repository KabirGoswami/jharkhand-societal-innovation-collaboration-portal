import { Router } from 'express';
import { aiService } from './ai.service';
import { sendResponse, sendError } from '../../utils/apiResponse';
import { authenticate, roleGuard } from '../../middleware/auth';

const router = Router();

router.post('/analyze-problem', authenticate, roleGuard('GOVT_ADMIN', 'FACULTY'), async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return sendError(res, 'Title and description are required', 400);
    }
    const analysis = await aiService.analyzeProblem(req.body);
    sendResponse(res, analysis);
  } catch (err: any) {
    sendError(res, err.message);
  }
});

router.post('/generate-proposal', authenticate, roleGuard('FACULTY'), async (req, res) => {
  try {
    const { problemId, heiId, customInstructions } = req.body;
    if (!problemId || !heiId) {
      return sendError(res, 'problemId and heiId are required', 400);
    }
    const proposal = await aiService.generateProposal(problemId, heiId, customInstructions);
    sendResponse(res, proposal);
  } catch (err: any) {
    sendError(res, err.message);
  }
});

export default router;
