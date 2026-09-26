import type { StaffService } from '../../domain/models/StaffService';
import type { Service } from '@modules/services/domain/models/Service';
import { categoryFromApi } from '@modules/services/infrastructure/mappers/serviceMapper';

// Estructura que devuelve el backend (StaffServiceResponseDTO)
export interface ApiStaffService {
  staffId: string;
  staffName?: string;
  serviceId: string;
  serviceName: string;
  serviceCategory?: string;
  servicePrice?: number;
  serviceDurationMin?: number;
  createdAt?: string;
}

// Estructura que devuelve el backend (ServiceResponseDTO) en /available
export interface ApiAvailableService {
  id: string;
  name: string;
  duration_min: number;
  price: number;
  description?: string;
  category?: string;
  is_popular?: boolean;
}

export function toStaffService(api: ApiStaffService): StaffService {
  return {
    staffId: api.staffId,
    staffName: api.staffName,
    serviceId: api.serviceId,
    serviceName: api.serviceName,
    serviceCategory: categoryFromApi(api.serviceCategory),
    servicePrice: api.servicePrice,
    serviceDurationMin: api.serviceDurationMin,
    createdAt: api.createdAt,
  };
}

export function toAvailableService(api: ApiAvailableService): Service {
  return {
    id: api.id,
    name: api.name,
    description: api.description ?? '',
    category: categoryFromApi(api.category),
    durationMin: api.duration_min,
    price: api.price,
    popular: api.is_popular ?? false,
  };
}