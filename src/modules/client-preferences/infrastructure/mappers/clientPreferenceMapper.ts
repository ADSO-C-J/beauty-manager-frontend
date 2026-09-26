import type { ClientPreference } from '../../domain/models/ClientPreference';

// Estructura que devuelve el backend (ClientPreferenceResponseDTO)
export interface ApiClientPreference {
  id: string;
  clientId: string;
  clientName?: string;
  key: string;
  value: string;
  createdAt?: string;
  updatedAt?: string;
}

export function toClientPreference(api: ApiClientPreference): ClientPreference {
  return {
    id: api.id,
    clientId: api.clientId,
    clientName: api.clientName,
    key: api.key,
    value: api.value,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
  };
}