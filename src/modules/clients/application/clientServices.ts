import { ClientApiRepository } from '../infrastructure/repository/ClientApiRepository';
import type { ClientRepository } from '../domain/ports/ClientRepository';
import type { ClientData } from '../domain/models/Client';

const repository: ClientRepository = new ClientApiRepository();

export const clientService = {
  searchClients: (query: string) => repository.searchClients(query),
  getClientById: (id: string) => repository.getClientById(id),
  createClient: (data: ClientData) => repository.createClient(data),
  updateClient: (id: string, data: ClientData) => repository.updateClient(id, data),
  deleteClient: (id: string) => repository.deleteClient(id),
};