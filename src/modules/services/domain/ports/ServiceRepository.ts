import type { Service, ServiceCategory } from '../models/Service';

export interface CreateServiceData {
  name: string;
  description?: string;
  category: ServiceCategory;
  durationMin: number;
  price: number;
}

export type UpdateServiceData = CreateServiceData;

export interface ServiceRepository {
  getServices(): Promise<Service[]>;
  getServiceById(id: string): Promise<Service>;
  createService(data: CreateServiceData): Promise<Service>;
  updateService(id: string, data: UpdateServiceData): Promise<Service>;
  deleteService(id: string): Promise<void>;
}
