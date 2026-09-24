import { AuditLogApiRepository } from '../infrastructure/repository/AuditLogApiRepository';
import type {
  AuditLogRepository,
  AuditLogFilters,
} from '../domain/ports/AuditLogRepository';

const repository: AuditLogRepository = new AuditLogApiRepository();

export const auditLogService = {
  getAuditLogs: (filters: AuditLogFilters = {}) => repository.getAuditLogs(filters),
  getAuditLogById: (id: number) => repository.getAuditLogById(id),
  getTableNames: () => repository.getTableNames(),
  getActions: () => repository.getActions(),
};