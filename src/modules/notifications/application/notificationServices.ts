import { NotificationApiRepository } from '../infrastructure/repository/NotificationApiRepository';
import type {
  NotificationRepository,
  CreateNotificationData,
} from '../domain/ports/NotificationRepository';

const repository: NotificationRepository = new NotificationApiRepository();

export const notificationService = {
  getNotifications: () => repository.getNotifications(),
  getUnreadNotifications: () => repository.getUnreadNotifications(),
  getUnreadCount: () => repository.getUnreadCount(),
  markAsRead: (id: string) => repository.markAsRead(id),
  markAllAsRead: () => repository.markAllAsRead(),
  createNotification: (data: CreateNotificationData) =>
    repository.createNotification(data),
  deleteNotification: (id: string) => repository.deleteNotification(id),
};