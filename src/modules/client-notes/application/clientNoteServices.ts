import { ClientNoteApiRepository } from '../infrastructure/repository/ClientNoteApiRepository';
import type {
  ClientNoteRepository,
  CreateClientNoteData,
} from '../domain/ports/ClientNoteRepository';

const repository: ClientNoteRepository = new ClientNoteApiRepository();

export const clientNoteService = {
  getNotes: (clientId: string) => repository.getNotes(clientId),
  getNoteById: (clientId: string, id: string) =>
    repository.getNoteById(clientId, id),
  createNote: (clientId: string, data: CreateClientNoteData) =>
    repository.createNote(clientId, data),
  updateNote: (clientId: string, id: string, content: string) =>
    repository.updateNote(clientId, id, content),
  deleteNote: (clientId: string, id: string) =>
    repository.deleteNote(clientId, id),
};