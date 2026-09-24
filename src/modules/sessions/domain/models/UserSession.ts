export interface UserSession {
  id: string;
  userId: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt?: string;
  expiresAt?: string;
  expired: boolean;
}