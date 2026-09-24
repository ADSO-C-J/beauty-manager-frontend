import type {
  Business,
  BusinessHours,
  NotificationPreferences,
  ScheduleDay,
} from '../../domain/models/Business';

// Reutiliza la normalización de tiempos del módulo de horarios del personal.
export { toTimeInput, toApiTime } from '@modules/staff-schedules/infrastructure/mappers/staffScheduleMapper';

// --- Business ---
export interface ApiBusiness {
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

export function toBusiness(api: ApiBusiness): Business {
  return {
    id: api.id,
    name: api.name,
    address: api.address,
    city: api.city,
    country: api.country,
    phone: api.phone,
    email: api.email,
    website: api.website,
    logoUrl: api.logoUrl,
    currency: api.currency,
    timezone: api.timezone,
  };
}

// --- BusinessHours ---
export interface ApiBusinessHours {
  id: string;
  businessId: string;
  day: string;
  opensAt?: string | null;
  closesAt?: string | null;
  isClosed: boolean;
}

export function toBusinessHours(api: ApiBusinessHours): BusinessHours {
  return {
    id: api.id,
    businessId: api.businessId,
    day: api.day as ScheduleDay,
    opensAt: api.opensAt,
    closesAt: api.closesAt,
    isClosed: api.isClosed ?? false,
  };
}

// --- NotificationPreferences ---
export interface ApiNotificationPreferences {
  id?: string;
  userId?: string;
  appointmentReminders: boolean;
  newClients: boolean;
  cancellations: boolean;
  monthlyReports: boolean;
  systemUpdates: boolean;
}

export function toNotificationPreferences(
  api: ApiNotificationPreferences
): NotificationPreferences {
  return {
    id: api.id,
    userId: api.userId,
    appointmentReminders: api.appointmentReminders ?? true,
    newClients: api.newClients ?? true,
    cancellations: api.cancellations ?? true,
    monthlyReports: api.monthlyReports ?? false,
    systemUpdates: api.systemUpdates ?? false,
  };
}