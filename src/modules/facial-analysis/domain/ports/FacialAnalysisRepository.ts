import type {
  FacialAnalysis,
  CreateFacialAnalysisData,
  FacialRecommendation,
} from '../models/FacialAnalysis';

export interface FacialAnalysisRepository {
  getAnalyses(clientId: string): Promise<FacialAnalysis[]>;
  getAnalysisById(clientId: string, id: string): Promise<FacialAnalysis | null>;
  createAnalysis(
    clientId: string,
    data: CreateFacialAnalysisData
  ): Promise<FacialAnalysis>;
  deleteAnalysis(clientId: string, id: string): Promise<void>;
  addRecommendation(
    clientId: string,
    analysisId: string,
    data: { category: string; title: string; description: string }
  ): Promise<FacialRecommendation>;
}