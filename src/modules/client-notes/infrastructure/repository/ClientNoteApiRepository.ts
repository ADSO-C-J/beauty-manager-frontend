import { axiosClient } from '@shared/http/axiosClient';
import type { ClientNote } from '../../domain/models/ClientNote';
import type {
  ClientNoteRepository,
  CreateClientNoteData,
} from '../../domain/ports/ClientNoteRepository';
import { toClientNote, type ApiClientNote } from '../mappers/clientNoteMapper';

export class ClientNoteApiRepository implements ClientNoteRepository {
  async getNotes(clientId: string): Promise<ClientNote[]> {
    const { data } = await axiosClient.get<ApiClientNote[]>(
      `/clients/${clientId}/notes`
    );
    return (data ?? []).map(toClientNote);
  }

  async getNoteById(clientId: string, id: string): Promise<ClientNote | null> {
    try {
      const { data } = await axiosClient.get<ApiClientNote>(
        `/clients/${clientId}/notes/${id}`
      );
      return toClientNote(data);
    } catch {
      return null;
    }
  }

  async createNote(clientId: string, data: CreateClientNoteData): Promise<ClientNote> {
    const { data: response } = await axiosClient.post<ApiClientNote>(
      `/clients/${clientId}/notes`,
      { content: data.content }
    );
    return toClientNote(response);
  }

  async updateNote(clientId: string, id: string, content: string): Promise<ClientNote> {
    const { data: response } = await axiosClient.put<ApiClientNote>(
      `/clients/${clientId}/notes/${id}`,
      { content }
    );
    return toClientNote(response);
  }

  async deleteNote(clientId: string, id: string): Promise<void> {
    await axiosClient.delete(`/clients/${clientId}/notes/${id}`);
  }
}