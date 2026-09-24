export interface AuditLog {
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

export interface AuditLogPage {
  content: AuditLog[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}