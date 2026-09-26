import type { ClientNote } from '../../domain/models/ClientNote';

// Estructura que devuelve el backend (ClientNoteResponseDTO)
export interface ApiClientNote {
  id: string;
  clientId: string;
  clientName?: string;
  staffId?: string;
  staffName?: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

export function toClientNote(api: ApiClientNote): ClientNote {
  return {
    id: api.id,
    clientId: api.clientId,
    clientName: api.clientName,
    staffId: api.staffId,
    staffName: api.staffName,
    content: api.content,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
  };
}