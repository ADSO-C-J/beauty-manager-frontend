import type {
  ReportMetrics,
  MonthlyRevenue,
  ServicePopularity,
  StaffPerformance,
  ServiceCategory,
} from '../../domain/models/Report';

// Estructura que devuelve el backend (ReportMetricsDTO)
export interface ApiReportMetrics {
  totalRevenue: number | string | null;
  totalAppointments: number | null;
  newClients: number | null;
  cancellationRate: number | null;
}

// Estructura que devuelve el backend (MonthlyRevenueDTO)
export interface ApiMonthlyRevenue {
  month: number;
  revenue: number | string | null;
}

// Estructura que devuelve el backend (ServicePopularityDTO)
export interface ApiServicePopularity {
  serviceName: string;
  category: string | null;
  bookingCount: number | null;
  revenue: number | string | null;
}

// Estructura que devuelve el backend (StaffPerformanceDTO)
export interface ApiStaffPerformance {
  staffId: string;
  staffName: string;
  specialty?: string;
  totalAppointments: number | null;
  totalRevenue: number | string | null;
  avgRating: number | null;
  totalReviews: number | null;
}

const MONTH_NAMES = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

// Categorías del backend (enum TypeServices, en minúsculas) a la UI
const UI_CATEGORY_BY_API: Record<string, ServiceCategory> = {
  cabello: 'Cabello',
  manos: 'Manos',
  pies: 'Pies',
  caballeros: 'Caballeros',
  facial: 'Facial',
  otro: 'Otro',
};

export function monthName(month: number): string {
  return MONTH_NAMES[month - 1] ?? String(month);
}

function toNumber(value: number | string | null | undefined): number {
  if (value === null || value === undefined) return 0;
  const n = typeof value === 'string' ? Number(value) : value;
  return Number.isFinite(n) ? n : 0;
}

export function categoryFromApi(category?: string | null): ServiceCategory {
  if (!category) return 'Otro';
  return UI_CATEGORY_BY_API[category.toLowerCase()] ?? 'Otro';
}

export function toReportMetrics(api: ApiReportMetrics): ReportMetrics {
  return {
    totalRevenue: toNumber(api.totalRevenue),
    totalAppointments: api.totalAppointments ?? 0,
    newClients: api.newClients ?? 0,
    cancellationRate: api.cancellationRate ?? 0,
  };
}

export function toMonthlyRevenue(api: ApiMonthlyRevenue): MonthlyRevenue {
  return {
    month: api.month,
    revenue: toNumber(api.revenue),
  };
}

export function toServicePopularity(api: ApiServicePopularity): ServicePopularity {
  return {
    serviceName: api.serviceName,
    category: categoryFromApi(api.category),
    bookingCount: api.bookingCount ?? 0,
    revenue: toNumber(api.revenue),
  };
}

export function toStaffPerformance(api: ApiStaffPerformance): StaffPerformance {
  return {
    staffId: api.staffId,
    staffName: api.staffName,
    specialty: api.specialty,
    totalAppointments: api.totalAppointments ?? 0,
    totalRevenue: toNumber(api.totalRevenue),
    avgRating: api.avgRating,
    totalReviews: api.totalReviews ?? 0,
  };
}