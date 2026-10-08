import { FacialAnalysisApiRepository } from '../infrastructure/repository/FacialAnalysisApiRepository';
import type { FacialAnalysisRepository } from '../domain/ports/FacialAnalysisRepository';
import type { CreateFacialAnalysisData } from '../domain/models/FacialAnalysis';
import { clientService } from '@modules/clients/application/clientServices';

const repository: FacialAnalysisRepository = new FacialAnalysisApiRepository();

// Caché por email para no re-consultar la lista de clientes en cada operación.
const clientIdCache = new Map<string, string | null>();

/**
 * Resuelve el `id` de la entidad Client a partir del email del usuario autenticado.
 * El backend maneja los clientes como una entidad separada del usuario, por lo que
 * el `user.id` no es válido para /clients/{id}/facial-analyses. Se busca por email.
 */
export async function resolveClientIdByEmail(
  email?: string
): Promise<string | null> {
  if (!email) return null;
  const key = email.toLowerCase();
  if (clientIdCache.has(key)) return clientIdCache.get(key) ?? null;
  try {
    const clients = await clientService.searchClients('');
    const match = clients.find(
      (c) => c.email?.toLowerCase() === key
    );
    const id = match?.id ?? null;
    clientIdCache.set(key, id);
    return id;
  } catch {
    return null;
  }
}

export const facialAnalysisService = {
  getAnalyses: (clientId: string) => repository.getAnalyses(clientId),
  getAnalysisById: (clientId: string, id: string) =>
    repository.getAnalysisById(clientId, id),
  createAnalysis: (clientId: string, data: CreateFacialAnalysisData) =>
    repository.createAnalysis(clientId, data),
  deleteAnalysis: (clientId: string, id: string) =>
    repository.deleteAnalysis(clientId, id),
  addRecommendation: (
    clientId: string,
    analysisId: string,
    data: { category: string; title: string; description: string }
  ) => repository.addRecommendation(clientId, analysisId, data),
};