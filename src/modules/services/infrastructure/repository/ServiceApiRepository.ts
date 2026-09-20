import { axiosClient } from '@shared/http/axiosClient';
import { useAuthStore } from '@modules/auth/application/state/authStore';
import type { Service } from '../../domain/models/Service';
import type {
  CreateServiceData,
  ServiceRepository,
  UpdateServiceData,
} from '../../domain/ports/ServiceRepository';
import { categoryToApi, toService, type ApiService } from '../mappers/serviceMapper';

// Fallback por si todavía no hay sesión cargada. Corresponde al negocio del seed
// y coincide con el DEFAULT_BUSINESS_ID que usa el backend (AppointmentServiceImpl).
const FALLBACK_BUSINESS_ID = 'b0000000-0000-0000-0000-000000000001';

/** Negocio del usuario autenticado; si aún no está disponible, usa el fallback. */
function currentBusinessId(): string {
  return useAuthStore.getState().user?.businessId ?? FALLBACK_BUSINESS_ID;
}

export class ServiceApiRepository implements ServiceRepository {
  async getServices(): Promise<Service[]> {
    const { data } = await axiosClient.get<ApiService[]>('/services');
    return data.map(toService);
  }

  async getServiceById(id: string): Promise<Service> {
    const { data } = await axiosClient.get<ApiService>(`/services/${id}`);
    return toService(data);
  }

  async createService(payload: CreateServiceData): Promise<Service> {
    const { data } = await axiosClient.post<ApiService>('/services', {
      businessId: currentBusinessId(),
      name: payload.name,
      description: payload.description,
      category: categoryToApi(payload.category),
      duration_min: payload.durationMin,
      price: payload.price,
    });
    return toService(data);
  }

  async updateService(id: string, payload: UpdateServiceData): Promise<Service> {
    const { data } = await axiosClient.put<ApiService>(`/services/${id}`, {
      businessId: currentBusinessId(),
      name: payload.name,
      description: payload.description,
      category: categoryToApi(payload.category),
      duration_min: payload.durationMin,
      price: payload.price,
    });
    return toService(data);
  }

  async deleteService(id: string): Promise<void> {
    await axiosClient.delete(`/services/${id}`);
  }
}
