// Valores válidos del backend (enums en minúsculas, tal como los espera la API)
export type SkinTone =
  | 'muy_clara'
  | 'clara'
  | 'morena_clara'
  | 'morena'
  | 'morena_oscura'
  | 'oscura';

export type HairType = 'lacio' | 'ondulado' | 'rizado' | 'crespo' | 'afro';

export type FaceShape =
  | 'ovalado'
  | 'redondo'
  | 'cuadrado'
  | 'corazon'
  | 'diamante'
  | 'rectangular';

export interface FacialRecommendation {
  id: string;
  category: string;
  title: string;
  description: string;
  createdAt?: string;
}

export interface FacialAnalysis {
  id: string;
  clientId: string;
  clientName?: string;
  staffId?: string;
  staffName?: string;
  imageUrl?: string;
  skinTone: SkinTone;
  skinToneHex?: string;
  hairType: HairType;
  faceShape: FaceShape;
  confidencePct?: number;
  rawResult?: Record<string, unknown>;
  createdAt?: string;
  recommendations: FacialRecommendation[];
}

export interface CreateFacialAnalysisData {
  imageUrl?: string;
  skinTone: SkinTone;
  skinToneHex?: string;
  hairType: HairType;
  faceShape: FaceShape;
  confidencePct?: number;
  recommendations?: { category: string; title: string; description: string }[];
}