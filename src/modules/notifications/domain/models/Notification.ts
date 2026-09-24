export interface Notification {
  id: string;
  type: string;
  title: string;
  body?: string;
  isRead: boolean;
  readAt?: string;
  metadata?: Record<string, unknown>;
  createdAt?: string;
}