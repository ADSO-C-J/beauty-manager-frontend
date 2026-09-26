import type {
  ReportRange,
  ReportMetrics,
  MonthlyRevenue,
  ServicePopularity,
  StaffPerformance,
} from '../models/Report';

export interface ReportRepository {
  getMetrics(range: ReportRange): Promise<ReportMetrics>;
  getMonthlyRevenue(): Promise<MonthlyRevenue[]>;
  getServicePopularity(): Promise<ServicePopularity[]>;
  getStaffPerformance(): Promise<StaffPerformance[]>;
}