import {
  X,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  History,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@components/button';
import { Card, CardContent } from '@components/card';
import { Badge } from '@components/badge';
import { Input } from '@components/input';
import { Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/select';
import { cn } from '@components/utils';
import type { AuditLog } from '@modules/audit-logs/domain/models/AuditLog';
import {
  describeAction,
  actionColors,
} from '@modules/audit-logs/infrastructure/mappers/auditLogMapper';
import { useAuditLogsPresenter } from './useAuditLogsPresenter';

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

// Todas las claves presentes en old y new, para mostrar el diff completo.
const diffKeys = (oldValues?: Record<string, unknown>, newValues?: Record<string, unknown>) => {
  const keys = new Set<string>([
    ...Object.keys(oldValues ?? {}),
    ...Object.keys(newValues ?? {}),
  ]);
  return Array.from(keys);
};

const renderValue = (value: unknown) => {
  if (value === undefined) return '—';
  if (value === null) return 'null';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};

const AuditLogDetail = ({
  log,
  onClose,
}: {
  log: AuditLog;
  onClose: () => void;
}) => {
  const keys = diffKeys(log.oldValues, log.newValues);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h3 className="text-xl font-semibold text-[#2D3748]">Detalle de auditoría</h3>
          <button onClick={onClose} className="text-[#718096] hover:text-[#2D3748]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <Badge className={actionColors[log.action] ?? actionColors.UPDATE}>
              {describeAction(log.action)}
            </Badge>
            <span className="text-sm text-[#718096]">#{log.id}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-[#718096] mb-1">Tabla</p>
              <p className="text-sm font-semibold text-[#2D3748]">
                {log.tableName ?? '—'}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-[#718096] mb-1">Registro afectado</p>
              <p className="text-sm font-semibold text-[#2D3748] break-all">
                {log.recordId ?? '—'}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-[#718096] mb-1">Usuario</p>
              <p className="text-sm font-semibold text-[#2D3748] break-all">
                {log.userId ?? '—'}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-[#718096] mb-1">IP</p>
              <p className="text-sm font-semibold text-[#2D3748]">{log.ipAddress ?? '—'}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-[#2D3748] mb-2">
              Cambios ({keys.length} campo{keys.length === 1 ? '' : 's'})
            </p>
            {keys.length === 0 ? (
              <p className="text-sm text-[#718096]">Sin datos de valores.</p>
            ) : (
              <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr_1fr] gap-2 px-3 py-2 bg-gray-50 text-xs font-medium text-[#718096]">
                  <span>Campo</span>
                  <span>Antes</span>
                  <span>Después</span>
                </div>
                {keys.map((key) => {
                  const before = log.oldValues?.[key];
                  const after = log.newValues?.[key];
                  const changed = renderValue(before) !== renderValue(after);
                  return (
                    <div
                      key={key}
                      className={cn(
                        'grid grid-cols-1 sm:grid-cols-[140px_1fr_1fr] gap-2 px-3 py-2 text-sm',
                        changed && 'bg-[#ECC94B]/5'
                      )}
                    >
                      <span className="font-medium text-[#4A5568] break-all">{key}</span>
                      <span className="text-[#E53E3E] break-all">
                        {renderValue(before)}
                      </span>
                      <span className="text-[#38A169] break-all">
                        {renderValue(after)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <p className="text-xs text-[#A0AEC0]">Fecha: {formatDateTime(log.createdAt)}</p>

          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AuditLogs = () => {
  const {
    logs,
    tableNames,
    actions,
    page,
    totalPages,
    totalElements,
    filterTable,
    filterAction,
    filterUserId,
    hasFilters,
    isLoading,
    error,
    detailLog,
    setDetailLog,
    clearError,
    setPage,
    changeTable,
    changeAction,
    changeUserId,
    clearFilters,
  } = useAuditLogsPresenter();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-[#2D3748]">Auditoría</h2>
        <p className="text-[#4A5568] mt-1">
          Historial de cambios del sistema ({totalElements} registro
          {totalElements === 1 ? '' : 's'})
        </p>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#718096]" />
            <span className="text-sm font-medium text-[#4A5568]">Filtros</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select
              value={filterTable || 'all'}
              onValueChange={(v) => changeTable(v === 'all' ? '' : v)}
            >
              <SelectTrigger aria-label="Filtrar por tabla">
                <SelectValue placeholder="Tabla" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las tablas</SelectItem>
                {tableNames.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filterAction || 'all'}
              onValueChange={(v) => changeAction(v === 'all' ? '' : v)}
            >
              <SelectTrigger aria-label="Filtrar por acción">
                <SelectValue placeholder="Acción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las acciones</SelectItem>
                {actions.map((a) => (
                  <SelectItem key={a} value={a}>
                    {describeAction(a)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-[#A0AEC0]" />
              <Input
                aria-label="Filtrar por usuario"
                placeholder="ID de usuario (UUID)"
                className="pl-9"
                value={filterUserId}
                onChange={(e) => changeUserId(e.target.value)}
              />
            </div>
          </div>
          {hasFilters && (
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Limpiar filtros
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {error && (
        <div
          className="flex items-center justify-between rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600"
          onClick={clearError}
        >
          <span className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </span>
          <X className="w-4 h-4 cursor-pointer" />
        </div>
      )}

      {isLoading && <p className="text-sm text-[#718096]">Cargando registros...</p>}

      {!isLoading && logs.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <History className="w-8 h-8 text-[#CBD5E0] mx-auto mb-2" />
            <p className="text-sm text-[#718096]">
              {hasFilters
                ? 'No hay registros que coincidan con los filtros.'
                : 'No hay registros de auditoría.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Listado */}
      <div className="grid gap-3">
        {logs.map((log) => (
          <Card key={log.id}>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Badge className={actionColors[log.action] ?? actionColors.UPDATE}>
                    {describeAction(log.action)}
                  </Badge>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#2D3748]">
                      {log.tableName ?? '—'}
                      {log.recordId && (
                        <span className="text-[#A0AEC0] font-normal">
                          {' '}
                          · {log.recordId.slice(0, 8)}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-[#718096]">
                      {formatDateTime(log.createdAt)}
                      {log.ipAddress ? ` · ${log.ipAddress}` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:ml-auto">
                  <span className="text-xs text-[#A0AEC0] hidden lg:inline">
                    {log.userId ? log.userId.slice(0, 8) : 'sistema'}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    aria-label={`Ver detalle ${log.id}`}
                    onClick={() => setDetailLog(log)}
                  >
                    Ver detalle
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#718096]">
            Página {page + 1} de {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              aria-label="Página anterior"
              onClick={() => setPage(Math.max(0, page - 1))}
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages - 1}
              aria-label="Página siguiente"
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Modal de detalle */}
      {detailLog && (
        <AuditLogDetail log={detailLog} onClose={() => setDetailLog(null)} />
      )}
    </div>
  );
};

export default AuditLogs;