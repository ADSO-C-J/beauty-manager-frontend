import { useCallback, useEffect, useMemo, useState } from 'react';
import { reportService } from '@modules/reports/application/reportServices';
import type {
  ReportMetrics,
  MonthlyRevenue,
  ServicePopularity,
  StaffPerformance,
  ReportRange,
} from '@modules/reports/domain/models/Report';
import { monthName } from '@modules/reports/infrastructure/mappers/reportMapper';

export const rangeLabels: Record<ReportRange, string> = {
  week: 'Esta semana',
  month: 'Este mes',
  quarter: 'Este trimestre',
  year: 'Este año',
};

const currency = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export function formatCurrency(value: number): string {
  return currency.format(value ?? 0);
}

export function useReportsPresenter() {
  const [metrics, setMetrics] = useState<ReportMetrics | null>(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([]);
  const [servicePopularity, setServicePopularity] = useState<ServicePopularity[]>([]);
  const [staffPerformance, setStaffPerformance] = useState<StaffPerformance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<ReportRange>('month');

  const loadMetrics = useCallback(
    async (range: ReportRange, isCancelled?: () => boolean) => {
      try {
        const data = await reportService.getMetrics(range);
        if (isCancelled?.()) return;
        setMetrics(data);
      } catch {
        if (isCancelled?.()) return;
        setError('No se pudieron cargar las métricas');
      }
    },
    []
  );

  const loadReports = useCallback(async (isCancelled?: () => boolean) => {
    setIsLoading(true);
    setError(null);
    try {
      const [revenue, services, staff] = await Promise.all([
        reportService.getMonthlyRevenue(),
        reportService.getServicePopularity(),
        reportService.getStaffPerformance(),
      ]);
      if (isCancelled?.()) return;
      setMonthlyRevenue(revenue);
      setServicePopularity(services);
      setStaffPerformance(staff);
    } catch {
      if (isCancelled?.()) return;
      setError('No se pudieron cargar los reportes');
    } finally {
      if (!isCancelled?.()) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const isCancelled = () => cancelled;
    // Diferido para evitar setState sincrónico dentro del effect (patrón del proyecto).
    Promise.resolve()
      .then(() => loadReports(isCancelled))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [loadReports]);

  // Las métricas dependen del rango seleccionado; se recargan al cambiar.
  useEffect(() => {
    let cancelled = false;
    const isCancelled = () => cancelled;
    Promise.resolve()
      .then(() => loadMetrics(dateRange, isCancelled))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [dateRange, loadMetrics]);

  // Datos listos para el gráfico de barras de ingresos mensuales.
  const revenueChartData = useMemo(
    () =>
      monthlyRevenue.map((item) => ({
        month: monthName(item.month),
        revenue: item.revenue,
      })),
    [monthlyRevenue]
  );

  // Datos listos para el gráfico circular de servicios más solicitados.
  const serviceChartData = useMemo(() => {
    const palette = ['#4A5568', '#718096', '#A0AEC0', '#CBD5E0', '#E2E8F0'];
    const total = servicePopularity.reduce((acc, s) => acc + s.bookingCount, 0);
    return servicePopularity.slice(0, 5).map((service, index) => ({
      name: service.serviceName,
      value: total > 0 ? Math.round((service.bookingCount * 100) / total) : 0,
      color: palette[index % palette.length],
    }));
  }, [servicePopularity]);

  return {
    metrics,
    dateRange,
    setDateRange,
    isLoading,
    error,
    revenueChartData,
    serviceChartData,
    staffPerformance,
    servicePopularity,
  };
}