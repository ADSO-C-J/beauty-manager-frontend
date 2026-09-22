export interface Review {
  id: string;
  appointmentId: string;
  clientId: string;
  staffId?: string;
  rating: number;      // 1 - 5
  comment?: string;
  isPublic: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RatingStats {
  staffId: string;
  staffName: string;
  averageRating: number;
  totalReviews: number;
}