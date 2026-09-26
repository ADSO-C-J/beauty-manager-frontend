import { axiosClient } from '@shared/http/axiosClient';
import type { StaffService } from '../../domain/models/StaffService';
import type { Service } from '@modules/services/domain/models/Service';
import type { StaffServiceRepository } from '../../domain/ports/StaffServiceRepository';
import {
  toStaffService,
  toAvailableService,
  type ApiStaffService,
  type ApiAvailableService,
} from '../mappers/staffServiceMapper';

export class StaffServiceApiRepository implements StaffServiceRepository {
  async getStaffServices(staffId: string): Promise<StaffService[]> {
    const { data } = await axiosClient.get<ApiStaffService[]>(
      `/staff/${staffId}/services`
    );
    return (data ?? []).map(toStaffService);
  }

  async getAvailableServices(staffId: string): Promise<Service[]> {
    const { data } = await axiosClient.get<ApiAvailableService[]>(
      `/staff/${staffId}/services/available`
    );
    return (data ?? []).map(toAvailableService);
  }

  async assignServices(staffId: string, serviceIds: string[]): Promise<StaffService[]> {
    const { data } = await axiosClient.post<ApiStaffService[]>(
      `/staff/${staffId}/services`,
      { serviceIds }
    );
    return (data ?? []).map(toStaffService);
  }

  async removeService(staffId: string, serviceId: string): Promise<void> {
    await axiosClient.delete(`/staff/${staffId}/services/${serviceId}`);
  }
}