import type { UserSession } from '../models/UserSession';

export interface SessionRepository {
  /** Sesiones activas del usuario autenticado (dispositivos con sesión abierta). */
  getMySessions(): Promise<UserSession[]>;
  /** Cierra una sesión concreta. Devuelve true si se revocó. */
  revokeSession(id: string): Promise<boolean>;
  /** Cierra todas las sesiones del usuario. Devuelve cuántas se revocaron. */
  revokeAllSessions(): Promise<number>;
}