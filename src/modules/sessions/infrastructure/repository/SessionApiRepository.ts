import { axiosClient } from '@shared/http/axiosClient';
import type { UserSession } from '../../domain/models/UserSession';
import type { SessionRepository } from '../../domain/ports/SessionRepository';
import { toUserSession, type ApiSession } from '../mappers/sessionMapper';

interface RevokeResponse {
  revoked: boolean | number;
}

export class SessionApiRepository implements SessionRepository {
  async getMySessions(): Promise<UserSession[]> {
    const { data } = await axiosClient.get<ApiSession[]>('/sessions');
    return (data ?? []).map(toUserSession);
  }

  async revokeSession(id: string): Promise<boolean> {
    const { data } = await axiosClient.delete<RevokeResponse>(`/sessions/${id}`);
    return Boolean(data?.revoked);
  }

  async revokeAllSessions(): Promise<number> {
    const { data } = await axiosClient.delete<RevokeResponse>('/sessions');
    return typeof data?.revoked === 'number' ? data.revoked : data?.revoked ? 1 : 0;
  }
}