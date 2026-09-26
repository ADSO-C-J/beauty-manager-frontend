import { ClientPreferenceApiRepository } from '../infrastructure/repository/ClientPreferenceApiRepository';
import type {
  ClientPreferenceRepository,
  UpsertClientPreferenceData,
} from '../domain/ports/ClientPreferenceRepository';

const repository: ClientPreferenceRepository = new ClientPreferenceApiRepository();

export const clientPreferenceService = {
  getPreferences: (clientId: string) => repository.getPreferences(clientId),
  getPreferenceById: (clientId: string, id: string) =>
    repository.getPreferenceById(clientId, id),
  upsertPreference: (clientId: string, data: UpsertClientPreferenceData) =>
    repository.upsertPreference(clientId, data),
  deletePreference: (clientId: string, id: string) =>
    repository.deletePreference(clientId, id),
};