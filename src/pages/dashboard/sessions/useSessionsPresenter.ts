import { useCallback, useEffect, useState } from 'react';
import { sessionService } from '@modules/sessions/application/sessionServices';
import type { UserSession } from '@modules/sessions/domain/models/UserSession';

export function useSessionsPresenter() {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [isRevokingAll, setIsRevokingAll] = useState(false);
  const [confirmRevokeAll, setConfirmRevokeAll] = useState(false);

  const loadSessions = useCallback(async (isCancelled?: () => boolean) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await sessionService.getMySessions();
      if (isCancelled?.()) return;
      setSessions(data);
    } catch {
      if (isCancelled?.()) return;
      setError('No se pudieron cargar tus sesiones activas');
    } finally {
      if (!isCancelled?.()) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const isCancelled = () => cancelled;
    // Diferido para evitar setState sincrónico dentro del effect (patrón del proyecto).
    Promise.resolve()
      .then(() => loadSessions(isCancelled))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [loadSessions]);

  const reload = useCallback(async () => {
    await loadSessions();
  }, [loadSessions]);

  const revokeSession = async (session: UserSession) => {
    setRevokingId(session.id);
    setError(null);
    setSuccess(null);
    try {
      await sessionService.revokeSession(session.id);
      setSessions((prev) => prev.filter((s) => s.id !== session.id));
      setSuccess('Sesión cerrada correctamente');
    } catch {
      setError('No se pudo cerrar la sesión');
    } finally {
      setRevokingId(null);
    }
  };

  const revokeAll = async () => {
    setIsRevokingAll(true);
    setError(null);
    setSuccess(null);
    try {
      const count = await sessionService.revokeAllSessions();
      setSessions([]);
      setSuccess(
        count > 0
          ? `Se cerraron ${count} sesión${count === 1 ? '' : 'es'}`
          : 'No había sesiones que cerrar'
      );
      setConfirmRevokeAll(false);
    } catch {
      setError('No se pudieron cerrar todas las sesiones');
    } finally {
      setIsRevokingAll(false);
    }
  };

  return {
    sessions,
    isLoading,
    error,
    success,
    revokingId,
    isRevokingAll,
    confirmRevokeAll,
    setConfirmRevokeAll,
    clearMessages: () => {
      setError(null);
      setSuccess(null);
    },
    revokeSession,
    revokeAll,
    reload,
  };
}