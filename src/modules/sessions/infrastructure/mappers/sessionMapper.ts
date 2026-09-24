import type { UserSession } from '../../domain/models/UserSession';

// Estructura que devuelve el backend (SessionResponseDTO)
export interface ApiSession {
  id: string;
  userId: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt?: string;
  expiresAt?: string;
  expired: boolean;
}

export function toUserSession(api: ApiSession): UserSession {
  return {
    id: api.id,
    userId: api.userId,
    ipAddress: api.ipAddress,
    userAgent: api.userAgent,
    createdAt: api.createdAt,
    expiresAt: api.expiresAt,
    expired: api.expired ?? false,
  };
}

/**
 * Deriva un nombre de dispositivo legible a partir del user-agent.
 * No pretende ser exhaustivo: solo orientar al usuario sobre qué sesión cerrar.
 */
export function describeDevice(userAgent?: string): {
  device: string;
  browser: string;
} {
  const ua = (userAgent ?? '').toLowerCase();

  let device = 'Dispositivo desconocido';
  if (ua.includes('iphone')) device = 'iPhone';
  else if (ua.includes('ipad')) device = 'iPad';
  else if (ua.includes('android')) device = 'Android';
  else if (ua.includes('mac os') || ua.includes('macintosh')) device = 'Mac';
  else if (ua.includes('windows')) device = 'Windows';
  else if (ua.includes('linux')) device = 'Linux';

  let browser = 'Navegador desconocido';
  if (ua.includes('edg/')) browser = 'Edge';
  else if (ua.includes('chrome') && !ua.includes('chromium')) browser = 'Chrome';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
  else if (ua.includes('postman')) browser = 'Postman';
  else if (ua.includes('curl')) browser = 'cURL';

  return { device, browser };
}