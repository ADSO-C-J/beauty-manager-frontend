import type { StaffService } from '../models/StaffService';
import type { Service } from '@modules/services/domain/models/Service';

export interface StaffServiceRepository {
  /** Servicios ya asignados al miembro del personal. */
  getStaffServices(staffId: string): Promise<StaffService[]>;
  /** Servicios que aún se pueden asignar (los demás, activos). */
  getAvailableServices(staffId: string): Promise<Service[]>;
  /** Asigna uno o varios servicios al miembro del personal. */
  assignServices(staffId: string, serviceIds: string[]): Promise<StaffService[]>;
  /** Quita un servicio del miembro del personal. */
  removeService(staffId: string, serviceId: string): Promise<void>;
}