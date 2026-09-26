import { axiosClient } from '@shared/http/axiosClient';
import type { ClientPreference } from '../../domain/models/ClientPreference';
import type {
  ClientPreferenceRepository,
  UpsertClientPreferenceData,
} from '../../domain/ports/ClientPreferenceRepository';
import {
  toClientPreference,
  type ApiClientPreference,
} from '../mappers/clientPreferenceMapper';

export class ClientPreferenceApiRepository implements ClientPreferenceRepository {
  async getPreferences(clientId: string): Promise<ClientPreference[]> {
    const { data } = await axiosClient.get<ApiClientPreference[]>(
      `/clients/${clientId}/preferences`
    );
    return (data ?? []).map(toClientPreference);
  }

  async getPreferenceById(
    clientId: string,
    id: string
  ): Promise<ClientPreference | null> {
    try {
      const { data } = await axiosClient.get<ApiClientPreference>(
        `/clients/${clientId}/preferences/${id}`
      );
      return toClientPreference(data);
    } catch {
      return null;
    }
  }

  async upsertPreference(
    clientId: string,
    data: UpsertClientPreferenceData
  ): Promise<ClientPreference> {
    const { data: response } = await axiosClient.post<ApiClientPreference>(
      `/clients/${clientId}/preferences`,
      { key: data.key, value: data.value }
    );
    return toClientPreference(response);
  }

  async deletePreference(clientId: string, id: string): Promise<void> {
    await axiosClient.delete(`/clients/${clientId}/preferences/${id}`);
  }
}