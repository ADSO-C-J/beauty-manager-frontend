import type { ServiceCategory } from '@modules/services/domain/models/Service';

/** Servicio asignado a un miembro del personal (tabla staff_services). */
export interface StaffService {
  staffId: string;
  staffName?: string;
  serviceId: string;
  serviceName: string;
  serviceCategory?: ServiceCategory;
  servicePrice?: number;
  serviceDurationMin?: number;
  createdAt?: string;
}