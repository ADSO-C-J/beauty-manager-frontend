import { useCallback, useEffect, useState } from 'react';
import { auditLogService } from '@modules/audit-logs/application/auditLogServices';
import type { AuditLog } from '@modules/audit-logs/domain/models/AuditLog';

const PAGE_SIZE = 20;

export function useAuditLogsPresenter() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [tableNames, setTableNames] = useState<string[]>([]);
  const [actions, setActions] = useState<string[]>([]);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [filterTable, setFilterTable] = useState('');
  const [filterAction, setFilterAction] = useState('');
  const [filterUserId, setFilterUserId] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailLog, setDetailLog] = useState<AuditLog | null>(null);

  const loadLogs = useCallback(
    async (
      opts: {
        page: number;
        tableName: string;
        action: string;
        userId: string;
      },
      isCancelled?: () => boolean
    ) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await auditLogService.getAuditLogs({
          page: opts.page,
          size: PAGE_SIZE,
          tableName: opts.tableName || undefined,
          action: opts.action || undefined,
          userId: opts.userId || undefined,
        });
        if (isCancelled?.()) return;
        setLogs(result.content);
        setTotalPages(result.totalPages);
        setTotalElements(result.totalElements);
      } catch {
        if (isCancelled?.()) return;
        setError('No se pudieron cargar los registros de auditoría');
      } finally {
        if (!isCancelled?.()) setIsLoading(false);
      }
    },
    []
  );

  const loadFilters = useCallback(async (isCancelled?: () => boolean) => {
    const [tablesRes, actionsRes] = await Promise.allSettled([
      auditLogService.getTableNames(),
      auditLogService.getActions(),
    ]);
    if (isCancelled?.()) return;
    if (tablesRes.status === 'fulfilled') setTableNames(tablesRes.value);
    if (actionsRes.status === 'fulfilled') setActions(actionsRes.value);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const isCancelled = () => cancelled;
    // Diferido para evitar setState sincrónico dentro del effect (patrón del proyecto).
    Promise.resolve()
      .then(() => loadFilters(isCancelled))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [loadFilters]);

  // Recarga cuando cambian página o filtros.
  useEffect(() => {
    let cancelled = false;
    const isCancelled = () => cancelled;
    Promise.resolve()
      .then(() =>
        loadLogs(
          { page, tableName: filterTable, action: filterAction, userId: filterUserId },
          isCancelled
        )
      )
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [page, filterTable, filterAction, filterUserId, loadLogs]);

  const reload = useCallback(async () => {
    await loadLogs({
      page,
      tableName: filterTable,
      action: filterAction,
      userId: filterUserId,
    });
  }, [loadLogs, page, filterTable, filterAction, filterUserId]);

  // Los cambios de filtro resetean a la primera página.
  const changeTable = (value: string) => {
    setFilterTable(value);
    setPage(0);
  };
  const changeAction = (value: string) => {
    setFilterAction(value);
    setPage(0);
  };
  const changeUserId = (value: string) => {
    setFilterUserId(value);
    setPage(0);
  };

  const hasFilters = Boolean(filterTable || filterAction || filterUserId);

  const clearFilters = () => {
    setFilterTable('');
    setFilterAction('');
    setFilterUserId('');
    setPage(0);
  };

  return {
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
    clearError: () => setError(null),
    setPage,
    changeTable,
    changeAction,
    changeUserId,
    clearFilters,
    reload,
  };
}