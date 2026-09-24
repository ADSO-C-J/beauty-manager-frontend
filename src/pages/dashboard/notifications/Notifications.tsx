import {
  X,
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Calendar,
  XCircle,
  UserPlus,
  CreditCard,
  Info,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@components/button';
import { Card, CardContent } from '@components/card';
import { Badge } from '@components/badge';
import { Tabs, TabsList, TabsTrigger } from '@components/tabs';
import { cn } from '@components/utils';
import { describeType } from '@modules/notifications/infrastructure/mappers/notificationMapper';
import type { Notification } from '@modules/notifications/domain/models/Notification';
import { useNotificationsPresenter } from './useNotificationsPresenter';

// Devuelve el icono ya renderizado (no un componente), para no crearlo durante el render.
const TypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'cita_creada':
    case 'cita_confirmada':
      return <Calendar className="w-5 h-5" />;
    case 'cita_cancelada':
      return <XCircle className="w-5 h-5" />;
    case 'nuevo_cliente':
      return <UserPlus className="w-5 h-5" />;
    case 'pago':
      return <CreditCard className="w-5 h-5" />;
    case 'sistema':
      return <Info className="w-5 h-5" />;
    default:
      return <Bell className="w-5 h-5" />;
  }
};

const typeColor: Record<string, string> = {
  cita_creada: 'bg-[#4299E1]/10 text-[#3182CE]',
  cita_confirmada: 'bg-[#48BB78]/10 text-[#38A169]',
  cita_cancelada: 'bg-[#F56565]/10 text-[#E53E3E]',
  nuevo_cliente: 'bg-[#9F7AEA]/10 text-[#805AD5]',
  pago: 'bg-[#ECC94B]/10 text-[#D69E2E]',
  sistema: 'bg-[#4A5568]/10 text-[#4A5568]',
};

const formatDateTime = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

const NotificationRow = ({
  notification,
  isBusy,
  onRead,
  onDelete,
}: {
  notification: Notification;
  isBusy: boolean;
  onRead: (n: Notification) => void;
  onDelete: (n: Notification) => void;
}) => {
  const colorClass = typeColor[notification.type] ?? typeColor.sistema;

  return (
    <Card className={cn(!notification.isRead && 'border-l-4 border-l-[#4299E1]')}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn('p-3 rounded-lg shrink-0', colorClass)}>
            <TypeIcon type={notification.type} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={colorClass}>{describeType(notification.type)}</Badge>
              {!notification.isRead && (
                <span className="w-2 h-2 rounded-full bg-[#4299E1]" aria-label="no leída" />
              )}
            </div>
            <h3
              className={cn(
                'mt-1.5',
                notification.isRead
                  ? 'font-medium text-[#4A5568]'
                  : 'font-semibold text-[#2D3748]'
              )}
            >
              {notification.title}
            </h3>
            {notification.body && (
              <p className="text-sm text-[#718096] mt-0.5">{notification.body}</p>
            )}
            <p className="text-xs text-[#A0AEC0] mt-1">
              {formatDateTime(notification.createdAt)}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!notification.isRead && (
              <Button
                variant="outline"
                size="sm"
                disabled={isBusy}
                aria-label={`Marcar leída ${notification.title}`}
                onClick={() => onRead(notification)}
              >
                <Check className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              disabled={isBusy}
              aria-label={`Eliminar ${notification.title}`}
              className="border-red-300 text-red-500 hover:bg-red-50"
              onClick={() => onDelete(notification)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Notifications = () => {
  const {
    filteredNotifications,
    unreadCount,
    isLoading,
    error,
    success,
    busyId,
    filter,
    setFilter,
    clearMessages,
    markAsRead,
    markAllAsRead,
    remove,
  } = useNotificationsPresenter();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#2D3748]">Notificaciones</h2>
          <p className="text-[#4A5568] mt-1">
            {unreadCount > 0
              ? `Tienes ${unreadCount} notificación${unreadCount === 1 ? '' : 'es'} sin leer`
              : 'Estás al día, no tienes notificaciones sin leer'}
          </p>
        </div>
        <Button
          variant="outline"
          className="w-full sm:w-auto"
          disabled={unreadCount === 0}
          onClick={() => void markAllAsRead()}
        >
          <CheckCheck className="w-4 h-4 mr-2" />
          Marcar todas como leídas
        </Button>
      </div>

      {error && (
        <div
          className="flex items-center justify-between rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600"
          onClick={clearMessages}
        >
          <span className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </span>
          <X className="w-4 h-4 cursor-pointer" />
        </div>
      )}

      {success && (
        <div
          className="flex items-center justify-between rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700"
          onClick={clearMessages}
        >
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {success}
          </span>
          <X className="w-4 h-4 cursor-pointer" />
        </div>
      )}

      <Tabs
        value={filter}
        onValueChange={(v) => setFilter(v as 'all' | 'unread')}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-2 sm:w-72">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="unread">
            Sin leer{unreadCount > 0 ? ` (${unreadCount})` : ''}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading && <p className="text-sm text-[#718096]">Cargando notificaciones...</p>}

      {!isLoading && filteredNotifications.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Bell className="w-8 h-8 text-[#CBD5E0] mx-auto mb-2" />
            <p className="text-sm text-[#718096]">
              {filter === 'unread'
                ? 'No tienes notificaciones sin leer.'
                : 'No tienes notificaciones.'}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-3">
        {filteredNotifications.map((notification) => (
          <NotificationRow
            key={notification.id}
            notification={notification}
            isBusy={busyId === notification.id}
            onRead={(n) => void markAsRead(n)}
            onDelete={(n) => void remove(n)}
          />
        ))}
      </div>
    </div>
  );
};

export default Notifications;