import type { ClientNote } from '../models/ClientNote';

export interface CreateClientNoteData {
  content: string;
}

export interface ClientNoteRepository {
  getNotes(clientId: string): Promise<ClientNote[]>;
  getNoteById(clientId: string, id: string): Promise<ClientNote | null>;
  createNote(clientId: string, data: CreateClientNoteData): Promise<ClientNote>;
  updateNote(clientId: string, id: string, content: string): Promise<ClientNote>;
  deleteNote(clientId: string, id: string): Promise<void>;
}