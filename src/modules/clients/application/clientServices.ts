import { ClientApiRepository } from '../infrastructure/repository/ClientApiRepository';
import type { ClientRepository } from '../domain/ports/ClientRepository';

const repository: ClientRepository = new ClientApiRepository();

export const clientService = {
  searchClients: (query: string) => repository.searchClients(query),
};