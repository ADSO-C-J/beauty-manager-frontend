import { ServiceApiRepository } from '../infrastructure/repository/ServiceApiRepository';
import type {
  CreateServiceData,
  ServiceRepository,
  UpdateServiceData,
} from '../domain/ports/ServiceRepository';

const repository: ServiceRepository = new ServiceApiRepository();

export const serviceService = {
  getServices: () => repository.getServices(),
  getServiceById: (id: string) => repository.getServiceById(id),
  createService: (data: CreateServiceData) => repository.createService(data),
  updateService: (id: string, data: UpdateServiceData) =>
    repository.updateService(id, data),
  deleteService: (id: string) => repository.deleteService(id),
};
