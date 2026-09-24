// Los días del negocio usan el mismo enum DayOfWeek que los horarios del personal.
export type { ScheduleDay } from '@modules/staff-schedules/domain/models/StaffSchedule';

import type { ScheduleDay } from '@modules/staff-schedules/domain/models/StaffSchedule';

export interface Business {
  id: string;
  name: string;
  address?: string;
  city?: string;
  country: string;
  phone?: string;
  email?: string;
  website?: string;
  logoUrl?: string;
  currency: string;
  timezone?: string;
}

export interface BusinessHours {
  id: string;
  businessId: string;
  day: ScheduleDay;
  opensAt?: string | null; // "HH:mm:ss"
  closesAt?: string | null;
  isClosed: boolean;
}

export interface NotificationPreferences {
  id?: string;
  userId?: string;
  appointmentReminders: boolean;
  newClients: boolean;
  cancellations: boolean;
  monthlyReports: boolean;
  systemUpdates: boolean;
}