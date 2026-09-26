import { FacialAnalysisApiRepository } from '../infrastructure/repository/FacialAnalysisApiRepository';
import type { FacialAnalysisRepository } from '../domain/ports/FacialAnalysisRepository';
import type { CreateFacialAnalysisData } from '../domain/models/FacialAnalysis';

const repository: FacialAnalysisRepository = new FacialAnalysisApiRepository();

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