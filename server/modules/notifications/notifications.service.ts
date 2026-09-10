import { prisma } from '../../config/db';
import { SystemNotification } from '../../../src/types';

export class NotificationsService {
  async getAllNotifications() {
    return await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id: string) {
    return await prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  }

  async markAllAsRead() {
    return await prisma.notification.updateMany({
      data: { read: true },
    });
  }

  async createNotification(data: {
    type: string;
    title: string;
    message: string;
    targetRole?: string;
    recipientId?: string;
    actionUrl?: string;
  }) {
    return await prisma.notification.create({
      data: {
        ...data,
      },
    });
  }
}

export const notificationsService = new NotificationsService();
