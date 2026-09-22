import { StaffScheduleApiRepository } from '../infrastructure/repository/StaffScheduleApiRepository';
import type {
  StaffScheduleRepository,
  CreateStaffScheduleData,
  UpdateStaffScheduleData,
} from '../domain/ports/StaffScheduleRepository';

const repository: StaffScheduleRepository = new StaffScheduleApiRepository();

export const staffScheduleService = {
  getSchedules: () => repository.getSchedules(),
  getScheduleById: (id: string) => repository.getScheduleById(id),
  getSchedulesByStaff: (staffId: string) => repository.getSchedulesByStaff(staffId),
  createSchedule: (data: CreateStaffScheduleData) => repository.createSchedule(data),
  updateSchedule: (id: string, data: UpdateStaffScheduleData) =>
    repository.updateSchedule(id, data),
  deleteSchedule: (id: string) => repository.deleteSchedule(id),
};