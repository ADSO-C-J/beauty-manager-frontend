import { axiosClient } from '@shared/http/axiosClient';
import type {
  ReportMetrics,
  MonthlyRevenue,
  ServicePopularity,
  StaffPerformance,
  ReportRange,
} from '../../domain/models/Report';
import type { ReportRepository } from '../../domain/ports/ReportRepository';
import {
  toReportMetrics,
  toMonthlyRevenue,
  toServicePopularity,
  toStaffPerformance,
  type ApiReportMetrics,
  type ApiMonthlyRevenue,
  type ApiServicePopularity,
  type ApiStaffPerformance,
} from '../mappers/reportMapper';

export class ReportApiRepository implements ReportRepository {
  async getMetrics(range: ReportRange): Promise<ReportMetrics> {
    const { data } = await axiosClient.get<ApiReportMetrics>('/reports/metrics', {
      params: { range },
    });
    return toReportMetrics(data);
  }

  async getMonthlyRevenue(): Promise<MonthlyRevenue[]> {
    const { data } = await axiosClient.get<ApiMonthlyRevenue[]>(
      '/reports/revenue/monthly'
    );
    return (data ?? []).map(toMonthlyRevenue);
  }

  async getServicePopularity(): Promise<ServicePopularity[]> {
    const { data } = await axiosClient.get<ApiServicePopularity[]>(
      '/reports/services/popularity'
    );
    return (data ?? []).map(toServicePopularity);
  }

  async getStaffPerformance(): Promise<StaffPerformance[]> {
    const { data } = await axiosClient.get<ApiStaffPerformance[]>(
      '/reports/staff/performance'
    );
    return (data ?? []).map(toStaffPerformance);
  }
}