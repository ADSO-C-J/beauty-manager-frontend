import type { Client, ClientData } from '../models/Client';

export interface ClientRepository {
  searchClients(query: string): Promise<Client[]>;
  getClientById(id: string): Promise<Client | null>;
  createClient(data: ClientData): Promise<Client>;
  updateClient(id: string, data: ClientData): Promise<Client>;
  deleteClient(id: string): Promise<void>;
}