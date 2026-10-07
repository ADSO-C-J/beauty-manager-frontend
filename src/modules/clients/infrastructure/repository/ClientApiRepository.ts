import { axiosClient } from '@shared/http/axiosClient';
import type { Client, ClientData } from '../../domain/models/Client';
import type { ClientRepository } from '../../domain/ports/ClientRepository';

export class ClientApiRepository implements ClientRepository {
  async searchClients(query: string): Promise<Client[]> {
    const { data } = await axiosClient.get<Client[]>('/clients', {
      params: { search: query },
    });
    return data ?? [];
  }

  async getClientById(id: string): Promise<Client | null> {
    try {
      const { data } = await axiosClient.get<Client>(`/clients/${id}`);
      return data;
    } catch {
      return null;
    }
  }

  async createClient(data: ClientData): Promise<Client> {
    const { data: response } = await axiosClient.post<Client>('/clients', {
      name: data.name,
      email: data.email,
      phone: data.phone,
    });
    return response;
  }

  async updateClient(id: string, data: ClientData): Promise<Client> {
    const { data: response } = await axiosClient.put<Client>(`/clients/${id}`, {
      name: data.name,
      email: data.email,
      phone: data.phone,
    });
    return response;
  }

  async deleteClient(id: string): Promise<void> {
    await axiosClient.delete(`/clients/${id}`);
  }
}