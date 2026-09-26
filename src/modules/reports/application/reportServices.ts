import { ReportApiRepository } from '../infrastructure/repository/ReportApiRepository';
import type { ReportRepository } from '../domain/ports/ReportRepository';
import type { ReportRange } from '../domain/models/Report';

const repository: ReportRepository = new ReportApiRepository();

export const reportService = {
  getMetrics: (range: ReportRange) => repository.getMetrics(range),
  getMonthlyRevenue: () => repository.getMonthlyRevenue(),
  getServicePopularity: () => repository.getServicePopularity(),
  getStaffPerformance: () => repository.getStaffPerformance(),
};