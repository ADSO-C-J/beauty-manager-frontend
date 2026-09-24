import { useCallback, useEffect, useMemo, useState } from 'react';
import { notificationService } from '@modules/notifications/application/notificationServices';
import type { Notification } from '@modules/notifications/domain/models/Notification';

export type NotificationFilter = 'all' | 'unread';

export function useNotificationsPresenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [filter, setFilter] = useState<NotificationFilter>('all');
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadNotifications = useCallback(async (isCancelled?: () => boolean) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await notificationService.getNotifications();
      if (isCancelled?.()) return;
      setNotifications(data);
    } catch {
      if (isCancelled?.()) return;
      setError('No se pudieron cargar las notificaciones');
    } finally {
      if (!isCancelled?.()) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const isCancelled = () => cancelled;
    // Diferido para evitar setState sincrónico dentro del effect (patrón del proyecto).
    Promise.resolve()
      .then(() => loadNotifications(isCancelled))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [loadNotifications]);

  const reload = useCallback(async () => {
    await loadNotifications();
  }, [loadNotifications]);

  const markAsRead = async (notification: Notification) => {
    if (notification.isRead) return;
    setBusyId(notification.id);
    setError(null);
    try {
      const updated = await notificationService.markAsRead(notification.id);
      setNotifications((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
    } catch {
      setError('No se pudo marcar como leída');
    } finally {
      setBusyId(null);
    }
  };

  const markAllAsRead = async () => {
    setError(null);
    setSuccess(null);
    try {
      const updated = await notificationService.markAllAsRead();
      await reload();
      setSuccess(
        updated > 0
          ? `Se marcaron ${updated} notificación${updated === 1 ? '' : 'es'} como leídas`
          : 'No había notificaciones sin leer'
      );
    } catch {
      setError('No se pudieron marcar como leídas');
    }
  };

  const remove = async (notification: Notification) => {
    setBusyId(notification.id);
    setError(null);
    try {
      await notificationService.deleteNotification(notification.id);
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    } catch {
      setError('No se pudo eliminar la notificación');
    } finally {
      setBusyId(null);
    }
  };

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  const filteredNotifications = useMemo(
    () =>
      filter === 'unread'
        ? notifications.filter((n) => !n.isRead)
        : notifications,
    [notifications, filter]
  );

  return {
    notifications,
    filteredNotifications,
    unreadCount,
    isLoading,
    error,
    success,
    busyId,
    filter,
    setFilter,
    clearMessages: () => {
      setError(null);
      setSuccess(null);
    },
    markAsRead,
    markAllAsRead,
    remove,
    reload,
  };
}