import { StaffServiceApiRepository } from '../infrastructure/repository/StaffServiceApiRepository';
import type { StaffServiceRepository } from '../domain/ports/StaffServiceRepository';

const repository: StaffServiceRepository = new StaffServiceApiRepository();

export const staffServiceService = {
  getStaffServices: (staffId: string) => repository.getStaffServices(staffId),
  getAvailableServices: (staffId: string) =>
    repository.getAvailableServices(staffId),
  assignServices: (staffId: string, serviceIds: string[]) =>
    repository.assignServices(staffId, serviceIds),
  removeService: (staffId: string, serviceId: string) =>
    repository.removeService(staffId, serviceId),
};