import type { Client } from '../models/Client';

export interface ClientRepository {
  searchClients(query: string): Promise<Client[]>;
}