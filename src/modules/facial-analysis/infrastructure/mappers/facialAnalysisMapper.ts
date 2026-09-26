import type {
  FacialAnalysis,
  FacialRecommendation,
  SkinTone,
  HairType,
  FaceShape,
} from '../../domain/models/FacialAnalysis';

// Estructuras que devuelve el backend (FacialAnalysisResponseDTO / FacialRecommendationResponseDTO)
export interface ApiFacialRecommendation {
  id: string;
  category: string;
  title: string;
  description: string;
  createdAt?: string;
}

export interface ApiFacialAnalysis {
  id: string;
  clientId: string;
  clientName?: string;
  staffId?: string;
  staffName?: string;
  imageUrl?: string;
  skinTone: string;
  skinToneHex?: string;
  hairType: string;
  faceShape: string;
  confidencePct?: number | string;
  rawResult?: Record<string, unknown>;
  createdAt?: string;
  recommendations?: ApiFacialRecommendation[];
}

// Nombres legibles para la UI
export const SKIN_TONE_LABELS: Record<string, string> = {
  muy_clara: 'Piel Muy Clara',
  clara: 'Piel Clara',
  morena_clara: 'Piel Morena Clara',
  morena: 'Piel Morena',
  morena_oscura: 'Piel Morena Oscura',
  oscura: 'Piel Oscura',
};

export const HAIR_TYPE_LABELS: Record<string, string> = {
  lacio: 'Lacio',
  ondulado: 'Ondulado',
  rizado: 'Rizado',
  crespo: 'Crespo',
  afro: 'Afro',
};

export const FACE_SHAPE_LABELS: Record<string, string> = {
  ovalado: 'Ovalado',
  redondo: 'Redondo',
  cuadrado: 'Cuadrado',
  corazon: 'Corazón',
  diamante: 'Diamante',
  rectangular: 'Rectangular',
};

export function skinToneLabel(value: string): string {
  return SKIN_TONE_LABELS[value] ?? value;
}

export function hairTypeLabel(value: string): string {
  return HAIR_TYPE_LABELS[value] ?? value;
}

export function faceShapeLabel(value: string): string {
  return FACE_SHAPE_LABELS[value] ?? value;
}

export function toFacialRecommendation(
  api: ApiFacialRecommendation
): FacialRecommendation {
  return {
    id: api.id,
    category: api.category,
    title: api.title,
    description: api.description,
    createdAt: api.createdAt,
  };
}

export function toFacialAnalysis(api: ApiFacialAnalysis): FacialAnalysis {
  return {
    id: api.id,
    clientId: api.clientId,
    clientName: api.clientName,
    staffId: api.staffId,
    staffName: api.staffName,
    imageUrl: api.imageUrl,
    skinTone: api.skinTone as SkinTone,
    skinToneHex: api.skinToneHex,
    hairType: api.hairType as HairType,
    faceShape: api.faceShape as FaceShape,
    confidencePct:
      api.confidencePct === null || api.confidencePct === undefined
        ? undefined
        : Number(api.confidencePct),
    rawResult: api.rawResult,
    createdAt: api.createdAt,
    recommendations: (api.recommendations ?? []).map(toFacialRecommendation),
  };
}