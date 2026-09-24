import { axiosClient } from '@shared/http/axiosClient';
import type { AuditLog } from '../../domain/models/AuditLog';
import type {
  AuditLogRepository,
  AuditLogFilters,
} from '../../domain/ports/AuditLogRepository';
import {
  toAuditLog,
  toAuditLogPage,
  type ApiAuditLog,
  type ApiAuditLogPage,
} from '../mappers/auditLogMapper';

export class AuditLogApiRepository implements AuditLogRepository {
  async getAuditLogs(filters: AuditLogFilters) {
    const { data } = await axiosClient.get<ApiAuditLogPage>('/audit-logs', {
      params: {
        userId: filters.userId || undefined,
        tableName: filters.tableName || undefined,
        action: filters.action || undefined,
        page: filters.page ?? 0,
        size: filters.size ?? 20,
      },
    });
    return toAuditLogPage(data);
  }

  async getAuditLogById(id: number): Promise<AuditLog | null> {
    try {
      const { data } = await axiosClient.get<ApiAuditLog>(`/audit-logs/${id}`);
      return toAuditLog(data);
    } catch {
      return null;
    }
  }

  async getTableNames(): Promise<string[]> {
    const { data } = await axiosClient.get<string[]>('/audit-logs/table-names');
    return data ?? [];
  }

  async getActions(): Promise<string[]> {
    const { data } = await axiosClient.get<string[]>('/audit-logs/actions');
    return data ?? [];
  }
}