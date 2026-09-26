import type { ClientPreference } from '../models/ClientPreference';

export interface UpsertClientPreferenceData {
  key: string;
  value: string;
}

export interface ClientPreferenceRepository {
  getPreferences(clientId: string): Promise<ClientPreference[]>;
  getPreferenceById(clientId: string, id: string): Promise<ClientPreference | null>;
  upsertPreference(
    clientId: string,
    data: UpsertClientPreferenceData
  ): Promise<ClientPreference>;
  deletePreference(clientId: string, id: string): Promise<void>;
}