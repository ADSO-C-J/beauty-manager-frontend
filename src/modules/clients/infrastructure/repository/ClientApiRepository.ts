import { axiosClient } from '@shared/http/axiosClient';
import type { Client } from '../../domain/models/Client';
import type { ClientRepository } from '../../domain/ports/ClientRepository';

export class ClientApiRepository implements ClientRepository {
  async searchClients(query: string): Promise<Client[]> {
    const { data } = await axiosClient.get('/clients', {
      params: { search: query },
    });
    return data;
  }
}