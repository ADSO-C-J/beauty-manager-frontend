export type ReportRange = 'week' | 'month' | 'quarter' | 'year';

export interface ReportMetrics {
  totalRevenue: number;
  totalAppointments: number;
  newClients: number;
  cancellationRate: number; // porcentaje 0-100
}

export interface MonthlyRevenue {
  month: number; // 1-12
  revenue: number;
}

export type ServiceCategory =
  | 'Cabello'
  | 'Manos'
  | 'Pies'
  | 'Caballeros'
  | 'Facial'
  | 'Otro';

export interface ServicePopularity {
  serviceName: string;
  category: ServiceCategory;
  bookingCount: number;
  revenue: number;
}

export interface StaffPerformance {
  staffId: string;
  staffName: string;
  specialty?: string;
  totalAppointments: number;
  totalRevenue: number;
  avgRating: number | null;
  totalReviews: number;
}