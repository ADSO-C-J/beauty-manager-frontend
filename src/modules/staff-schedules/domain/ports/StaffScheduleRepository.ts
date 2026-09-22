import type { StaffSchedule, ScheduleDay } from '../models/StaffSchedule';

export interface CreateStaffScheduleData {
  staffId: string;
  day: ScheduleDay;
  startsAt: string; // "HH:mm"
  endsAt: string;   // "HH:mm"
}

export interface UpdateStaffScheduleData {
  startsAt: string; // "HH:mm"
  endsAt: string;   // "HH:mm"
  isActive?: boolean;
}

export interface StaffScheduleRepository {
  getSchedules(): Promise<StaffSchedule[]>;
  getScheduleById(id: string): Promise<StaffSchedule | null>;
  getSchedulesByStaff(staffId: string): Promise<StaffSchedule[]>;
  createSchedule(data: CreateStaffScheduleData): Promise<StaffSchedule>;
  updateSchedule(id: string, data: UpdateStaffScheduleData): Promise<StaffSchedule>;
  deleteSchedule(id: string): Promise<void>;
}