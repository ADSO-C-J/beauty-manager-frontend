import type { Review, RatingStats } from '../../domain/models/Review';

// Estructura que devuelve el backend (ReviewResponseDTO)
export interface ApiReview {
  id: string;
  appointmentId: string;
  clientId: string;
  staffId?: string;
  rating: number;
  comment?: string;
  isPublic: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Estructura que devuelve el backend (RatingStatsDTO)
export interface ApiRatingStats {
  staffId: string;
  staffName: string;
  averageRating: number | null;
  totalReviews: number;
}

export function toReview(api: ApiReview): Review {
  return {
    id: api.id,
    appointmentId: api.appointmentId,
    clientId: api.clientId,
    staffId: api.staffId,
    rating: api.rating,
    comment: api.comment,
    isPublic: api.isPublic,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
  };
}

export function toRatingStats(api: ApiRatingStats): RatingStats {
  return {
    staffId: api.staffId,
    staffName: api.staffName,
    averageRating: api.averageRating ?? 0,
    totalReviews: api.totalReviews,
  };
}