import type {
  Business,
  BusinessHours,
  NotificationPreferences,
  ScheduleDay,
} from '../models/Business';

export interface UpdateBusinessData {
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

export interface UpsertBusinessHoursData {
  day: ScheduleDay;
  opensAt?: string; // "HH:mm"
  closesAt?: string;
  isClosed: boolean;
}

export interface BusinessRepository {
  getBusiness(): Promise<Business>;
  updateBusiness(data: UpdateBusinessData): Promise<Business>;
  getBusinessHours(businessId: string): Promise<BusinessHours[]>;
  upsertBusinessHours(
    businessId: string,
    data: UpsertBusinessHoursData
  ): Promise<BusinessHours>;
  getNotificationPreferences(userId: string): Promise<NotificationPreferences>;
  updateNotificationPreferences(
    userId: string,
    data: NotificationPreferences
  ): Promise<NotificationPreferences>;
}