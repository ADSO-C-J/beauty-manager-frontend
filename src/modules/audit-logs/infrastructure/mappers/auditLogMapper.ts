import type { AuditLog, AuditLogPage } from '../../domain/models/AuditLog';

// Estructuras que devuelve el backend (AuditLogResponseDTO / AuditLogPageDTO)
export interface ApiAuditLog {
  id: number;
  userId?: string;
  action: string;
  tableName?: string;
  recordId?: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  ipAddress?: string;
  createdAt?: string;
}

export interface ApiAuditLogPage {
  content: ApiAuditLog[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export function toAuditLog(api: ApiAuditLog): AuditLog {
  return {
    id: api.id,
    userId: api.userId,
    action: api.action,
    tableName: api.tableName,
    recordId: api.recordId,
    oldValues: api.oldValues,
    newValues: api.newValues,
    ipAddress: api.ipAddress,
    createdAt: api.createdAt,
  };
}

export function toAuditLogPage(api: ApiAuditLogPage): AuditLogPage {
  return {
    content: (api.content ?? []).map(toAuditLog),
    page: api.page ?? 0,
    size: api.size ?? 20,
    totalElements: api.totalElements ?? 0,
    totalPages: api.totalPages ?? 0,
  };
}

// Etiquetas y colores por tipo de acción.
export const actionLabels: Record<string, string> = {
  INSERT: 'Creación',
  UPDATE: 'Actualización',
  DELETE: 'Eliminación',
};

export const actionColors: Record<string, string> = {
  INSERT: 'bg-[#48BB78]/10 text-[#38A169]',
  UPDATE: 'bg-[#ECC94B]/10 text-[#D69E2E]',
  DELETE: 'bg-[#F56565]/10 text-[#E53E3E]',
};

export function describeAction(action: string): string {
  return actionLabels[action] ?? action;
}