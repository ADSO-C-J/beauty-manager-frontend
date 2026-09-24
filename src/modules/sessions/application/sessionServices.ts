import { SessionApiRepository } from '../infrastructure/repository/SessionApiRepository';
import type { SessionRepository } from '../domain/ports/SessionRepository';

const repository: SessionRepository = new SessionApiRepository();

export const sessionService = {
  getMySessions: () => repository.getMySessions(),
  revokeSession: (id: string) => repository.revokeSession(id),
  revokeAllSessions: () => repository.revokeAllSessions(),
};