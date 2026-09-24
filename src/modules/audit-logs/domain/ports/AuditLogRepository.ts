import type { AuditLogPage } from '../models/AuditLog';

export interface AuditLogFilters {
  userId?: string;
  tableName?: string;
  action?: string;
  page?: number;
  size?: number;
}

export interface AuditLogRepository {
  /** Listado paginado y filtrable de registros de auditoría. */
  getAuditLogs(filters: AuditLogFilters): Promise<AuditLogPage>;
  /** Detalle de un registro por id. */
  getAuditLogById(id: number): Promise<AuditLogPage['content'][number] | null>;
  /** Tablas auditadas disponibles (para poblar filtros). */
  getTableNames(): Promise<string[]>;
  /** Acciones auditadas disponibles (para poblar filtros). */
  getActions(): Promise<string[]>;
}