import { axiosClient } from '@shared/http/axiosClient';
import type {
  FacialAnalysis,
  FacialRecommendation,
  CreateFacialAnalysisData,
} from '../../domain/models/FacialAnalysis';
import type { FacialAnalysisRepository } from '../../domain/ports/FacialAnalysisRepository';
import {
  toFacialAnalysis,
  toFacialRecommendation,
  type ApiFacialAnalysis,
  type ApiFacialRecommendation,
} from '../mappers/facialAnalysisMapper';

export class FacialAnalysisApiRepository implements FacialAnalysisRepository {
  async getAnalyses(clientId: string): Promise<FacialAnalysis[]> {
    const { data } = await axiosClient.get<ApiFacialAnalysis[]>(
      `/clients/${clientId}/facial-analyses`
    );
    return (data ?? []).map(toFacialAnalysis);
  }

  async getAnalysisById(
    clientId: string,
    id: string
  ): Promise<FacialAnalysis | null> {
    try {
      const { data } = await axiosClient.get<ApiFacialAnalysis>(
        `/clients/${clientId}/facial-analyses/${id}`
      );
      return toFacialAnalysis(data);
    } catch {
      return null;
    }
  }

  async createAnalysis(
    clientId: string,
    data: CreateFacialAnalysisData
  ): Promise<FacialAnalysis> {
    const { data: response } = await axiosClient.post<ApiFacialAnalysis>(
      `/clients/${clientId}/facial-analyses`,
      {
        imageUrl: data.imageUrl,
        skinTone: data.skinTone,
        skinToneHex: data.skinToneHex,
        hairType: data.hairType,
        faceShape: data.faceShape,
        confidencePct: data.confidencePct,
        recommendations: data.recommendations,
      }
    );
    return toFacialAnalysis(response);
  }

  async deleteAnalysis(clientId: string, id: string): Promise<void> {
    await axiosClient.delete(`/clients/${clientId}/facial-analyses/${id}`);
  }

  async addRecommendation(
    clientId: string,
    analysisId: string,
    data: { category: string; title: string; description: string }
  ): Promise<FacialRecommendation> {
    const { data: response } = await axiosClient.post<ApiFacialRecommendation>(
      `/clients/${clientId}/facial-analyses/${analysisId}/recommendations`,
      data
    );
    return toFacialRecommendation(response);
  }
}