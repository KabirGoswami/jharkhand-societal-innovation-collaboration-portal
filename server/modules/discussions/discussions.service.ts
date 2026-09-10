import { prisma } from '../../config/db';
import { DiscussionMessage } from '../../../src/types';

export class DiscussionService {
  async getMessagesByProblem(problemId: string) {
    return await prisma.discussion.findMany({
      where: { problemId },
      orderBy: { timestamp: 'asc' },
    });
  }

  async createMessage(data: {
    problemId: string;
    senderName: string;
    senderRole: string;
    message: string;
  }) {
    return await prisma.discussion.create({
      data: {
        problemId: data.problemId,
        senderName: data.senderName,
        senderRole: data.senderRole,
        message: data.message,
      },
    });
  }

  async deleteMessage(id: string) {
    return await prisma.discussion.delete({
      where: { id },
    });
  }
}

export const discussionService = new DiscussionService();
