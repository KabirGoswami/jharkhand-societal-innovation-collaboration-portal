import { Router } from 'express';
import { discussionService } from './discussions.service';
import { sendResponse, sendError } from '../../utils/apiResponse';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.get('/:problemId', async (req, res) => {
  try {
    const messages = await discussionService.getMessagesByProblem(req.params.problemId);
    sendResponse(res, messages);
  } catch (err: any) {
    sendError(res, err.message);
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { problemId, message } = req.body;
    if (!problemId || !message) {
      return sendError(res, 'problemId and message are required', 400);
    }

    const user = (req as any).user;
    const newMessage = await discussionService.createMessage({
      problemId,
      message,
      senderName: user.name || 'Registered User',
      senderRole: user.role,
    });

    sendResponse(res, newMessage, 201);
  } catch (err: any) {
    sendError(res, err.message);
  }
});

export default router;
