import type { Notification } from '../models/Notification';

export interface CreateNotificationData {
  type: string;
  title: string;
  body?: string;
  metadata?: Record<string, unknown>;
}

export interface NotificationRepository {
  /** Todas mis notificaciones, más recientes primero. */
  getNotifications(): Promise<Notification[]>;
  /** Solo las no leídas. */
  getUnreadNotifications(): Promise<Notification[]>;
  /** Número de no leídas (badge de la campana). */
  getUnreadCount(): Promise<number>;
  markAsRead(id: string): Promise<Notification>;
  /** Marca todas como leídas; devuelve cuántas cambió. */
  markAllAsRead(): Promise<number>;
  createNotification(data: CreateNotificationData): Promise<Notification>;
  deleteNotification(id: string): Promise<void>;
}