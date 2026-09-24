import { axiosClient } from '@shared/http/axiosClient';
import type {
  Business,
  BusinessHours,
  NotificationPreferences,
} from '../../domain/models/Business';
import type {
  BusinessRepository,
  UpdateBusinessData,
  UpsertBusinessHoursData,
} from '../../domain/ports/BusinessRepository';
import {
  toBusiness,
  toBusinessHours,
  toNotificationPreferences,
  toApiTime,
  type ApiBusiness,
  type ApiBusinessHours,
  type ApiNotificationPreferences,
} from '../mappers/businessMapper';

export class BusinessApiRepository implements BusinessRepository {
  async getBusiness(): Promise<Business> {
    const { data } = await axiosClient.get<ApiBusiness>('/business');
    return toBusiness(data);
  }

  async updateBusiness(data: UpdateBusinessData): Promise<Business> {
    const { data: response } = await axiosClient.put<ApiBusiness>('/business', {
      name: data.name,
      address: data.address,
      city: data.city,
      country: data.country,
      phone: data.phone,
      email: data.email,
      website: data.website,
      logoUrl: data.logoUrl,
      currency: data.currency,
      timezone: data.timezone,
    });
    return toBusiness(response);
  }

  async getBusinessHours(businessId: string): Promise<BusinessHours[]> {
    const { data } = await axiosClient.get<ApiBusinessHours[]>(
      `/business/${businessId}/hours`
    );
    return (data ?? []).map(toBusinessHours);
  }

  async upsertBusinessHours(
    businessId: string,
    data: UpsertBusinessHoursData
  ): Promise<BusinessHours> {
    const { data: response } = await axiosClient.put<ApiBusinessHours>(
      `/business/${businessId}/hours`,
      {
        day: data.day,
        opensAt: data.isClosed ? null : toApiTime(data.opensAt ?? ''),
        closesAt: data.isClosed ? null : toApiTime(data.closesAt ?? ''),
        isClosed: data.isClosed,
      }
    );
    return toBusinessHours(response);
  }

  async getNotificationPreferences(
    userId: string
  ): Promise<NotificationPreferences> {
    const { data } = await axiosClient.get<ApiNotificationPreferences>(
      `/notification-preferences/${userId}`
    );
    return toNotificationPreferences(data);
  }

  async updateNotificationPreferences(
    userId: string,
    data: NotificationPreferences
  ): Promise<NotificationPreferences> {
    const { data: response } = await axiosClient.put<ApiNotificationPreferences>(
      `/notification-preferences/${userId}`,
      {
        appointmentReminders: data.appointmentReminders,
        newClients: data.newClients,
        cancellations: data.cancellations,
        monthlyReports: data.monthlyReports,
        systemUpdates: data.systemUpdates,
      }
    );
    return toNotificationPreferences(response);
  }
}