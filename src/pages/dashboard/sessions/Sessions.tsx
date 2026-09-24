import {
  X,
  LogOut,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Clock,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@components/button';
import { Card, CardContent } from '@components/card';
import { Badge } from '@components/badge';
import { useSessionsPresenter } from './useSessionsPresenter';
import { describeDevice } from '@modules/sessions/infrastructure/mappers/sessionMapper';
import type { UserSession } from '@modules/sessions/domain/models/UserSession';

// Devuelve el icono ya renderizado (no un componente), para no crearlo durante el render.
const DeviceIcon = ({ userAgent }: { userAgent?: string }) => {
  const { device } = describeDevice(userAgent);
  if (device === 'iPhone' || device === 'Android') {
    return <Smartphone className="w-5 h-5 text-[#4A5568]" />;
  }
  if (device === 'iPad') {
    return <Tablet className="w-5 h-5 text-[#4A5568]" />;
  }
  if (device === 'Mac' || device === 'Windows' || device === 'Linux') {
    return <Monitor className="w-5 h-5 text-[#4A5568]" />;
  }
  return <Globe className="w-5 h-5 text-[#4A5568]" />;
};
const formatDateTime = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

const timeUntil = (iso?: string) => {
  if (!iso) return '—';
  const diffMs = new Date(iso).getTime() - Date.now();
  if (diffMs <= 0) return 'expirada';
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) return `${days}d ${hours}h`;
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};

const SessionRow = ({
  session,
  isRevoking,
  onRevoke,
}: {
  session: UserSession;
  isRevoking: boolean;
  onRevoke: (s: UserSession) => void;
}) => {
  const { device, browser } = describeDevice(session.userAgent);
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="p-3 rounded-lg bg-[#4A5568]/10 shrink-0">
              <DeviceIcon userAgent={session.userAgent} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-[#2D3748]">{device}</h3>
                <Badge className="bg-gray-200 text-[#4A5568]">{browser}</Badge>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 text-sm text-[#718096] mt-1">
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  {session.ipAddress ?? 'IP desconocida'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Inicio: {formatDateTime(session.createdAt)}
                </span>
              </div>
              <p className="text-xs text-[#A0AEC0] mt-1 truncate" title={session.userAgent}>
                {session.userAgent ?? 'Sin user-agent'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:ml-auto">
            <div className="text-right">
              <p className="text-xs text-[#718096]">Expira en</p>
              <p className="text-sm font-medium text-[#2D3748]">
                {timeUntil(session.expiresAt)}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              aria-label={`Cerrar sesión en ${device}`}
              disabled={isRevoking}
              className="border-red-300 text-red-500 hover:bg-red-50"
              onClick={() => onRevoke(session)}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Sessions = () => {
  const {
    sessions,
    isLoading,
    error,
    success,
    revokingId,
    isRevokingAll,
    confirmRevokeAll,
    setConfirmRevokeAll,
    clearMessages,
    revokeSession,
    revokeAll,
  } = useSessionsPresenter();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#2D3748]">Sesiones</h2>
          <p className="text-[#4A5568] mt-1">
            Dispositivos con sesión abierta en tu cuenta
          </p>
        </div>
        {sessions.length > 0 && (
          <Button
            variant="outline"
            className="border-red-300 text-red-500 hover:bg-red-50 w-full sm:w-auto"
            disabled={isRevokingAll}
            onClick={() => setConfirmRevokeAll(true)}
          >
            <ShieldAlert className="w-4 h-4 mr-2" />
            Cerrar todas las sesiones
          </Button>
        )}
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

      {isLoading && <p className="text-sm text-[#718096]">Cargando sesiones...</p>}

      {!isLoading && sessions.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-[#718096]">
              No hay sesiones activas registradas para tu cuenta.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {sessions.map((session) => (
          <SessionRow
            key={session.id}
            session={session}
            isRevoking={revokingId === session.id}
            onRevoke={revokeSession}
          />
        ))}
      </div>

      {/* Confirmación de cerrar todas */}
      {confirmRevokeAll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-semibold text-[#2D3748]">
                Cerrar todas las sesiones
              </h3>
              <button
                onClick={() => setConfirmRevokeAll(false)}
                className="text-[#718096] hover:text-[#2D3748]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-[#4A5568]">
                Se cerrarán las {sessions.length} sesiones activas, incluida la actual.
                Tendrás que volver a iniciar sesión en todos tus dispositivos.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  className="flex-1 bg-[#F56565] hover:bg-[#E53E3E] text-white"
                  disabled={isRevokingAll}
                  onClick={() => void revokeAll()}
                >
                  {isRevokingAll ? 'Cerrando...' : 'Sí, cerrar todas'}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setConfirmRevokeAll(false)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sessions;