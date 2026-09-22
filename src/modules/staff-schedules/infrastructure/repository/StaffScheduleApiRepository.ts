import { axiosClient } from '@shared/http/axiosClient';
import type { StaffSchedule } from '../../domain/models/StaffSchedule';
import type {
  StaffScheduleRepository,
  CreateStaffScheduleData,
  UpdateStaffScheduleData,
} from '../../domain/ports/StaffScheduleRepository';
import {
  toStaffSchedule,
  toApiTime,
  type ApiStaffSchedule,
} from '../mappers/staffScheduleMapper';

export class StaffScheduleApiRepository implements StaffScheduleRepository {
  async getSchedules(): Promise<StaffSchedule[]> {
    const { data } = await axiosClient.get<ApiStaffSchedule[]>('/staff-schedules');
    return (data ?? []).map(toStaffSchedule);
  }

  async getScheduleById(id: string): Promise<StaffSchedule | null> {
    try {
      const { data } = await axiosClient.get<ApiStaffSchedule>(`/staff-schedules/${id}`);
      return toStaffSchedule(data);
    } catch {
      return null;
    }
  }

  async getSchedulesByStaff(staffId: string): Promise<StaffSchedule[]> {
    const { data } = await axiosClient.get<ApiStaffSchedule[]>(
      `/staff-schedules/staff/${staffId}`
    );
    return (data ?? []).map(toStaffSchedule);
  }

  async createSchedule(data: CreateStaffScheduleData): Promise<StaffSchedule> {
    const { data: response } = await axiosClient.post<ApiStaffSchedule>('/staff-schedules', {
      staffId: data.staffId,
      day: data.day,
      startsAt: toApiTime(data.startsAt),
      endsAt: toApiTime(data.endsAt),
    });
    return toStaffSchedule(response);
  }

  async updateSchedule(
    id: string,
    data: UpdateStaffScheduleData
  ): Promise<StaffSchedule> {
    const { data: response } = await axiosClient.put<ApiStaffSchedule>(
      `/staff-schedules/${id}`,
      {
        startsAt: toApiTime(data.startsAt),
        endsAt: toApiTime(data.endsAt),
        isActive: data.isActive,
      }
    );
    return toStaffSchedule(response);
  }

  async deleteSchedule(id: string): Promise<void> {
    await axiosClient.delete(`/staff-schedules/${id}`);
  }
}