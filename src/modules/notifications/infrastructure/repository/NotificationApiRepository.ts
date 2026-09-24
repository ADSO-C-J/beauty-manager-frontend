import { axiosClient } from '@shared/http/axiosClient';
import type { Notification } from '../../domain/models/Notification';
import type {
  NotificationRepository,
  CreateNotificationData,
} from '../../domain/ports/NotificationRepository';
import { toNotification, type ApiNotification } from '../mappers/notificationMapper';

interface CountResponse {
  count?: number;
  updated?: number;
}

export class NotificationApiRepository implements NotificationRepository {
  async getNotifications(): Promise<Notification[]> {
    const { data } = await axiosClient.get<ApiNotification[]>('/notifications');
    return (data ?? []).map(toNotification);
  }

  async getUnreadNotifications(): Promise<Notification[]> {
    const { data } = await axiosClient.get<ApiNotification[]>('/notifications/unread');
    return (data ?? []).map(toNotification);
  }

  async getUnreadCount(): Promise<number> {
    const { data } = await axiosClient.get<CountResponse>('/notifications/unread-count');
    return data?.count ?? 0;
  }

  async markAsRead(id: string): Promise<Notification> {
    const { data } = await axiosClient.put<ApiNotification>(
      `/notifications/${id}/read`
    );
    return toNotification(data);
  }

  async markAllAsRead(): Promise<number> {
    const { data } = await axiosClient.put<CountResponse>('/notifications/read-all');
    return data?.updated ?? 0;
  }

  async createNotification(data: CreateNotificationData): Promise<Notification> {
    const { data: response } = await axiosClient.post<ApiNotification>('/notifications', {
      type: data.type,
      title: data.title,
      body: data.body,
      metadata: data.metadata,
    });
    return toNotification(response);
  }

  async deleteNotification(id: string): Promise<void> {
    await axiosClient.delete(`/notifications/${id}`);
  }
}