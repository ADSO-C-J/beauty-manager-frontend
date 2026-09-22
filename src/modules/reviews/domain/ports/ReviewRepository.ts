import type { Review, RatingStats } from '../models/Review';

export interface CreateReviewData {
  appointmentId: string;
  clientId: string;
  staffId?: string;
  rating: number;
  comment?: string;
  isPublic: boolean;
}

export interface UpdateReviewData {
  rating?: number;
  comment?: string;
  isPublic?: boolean;
}

export interface ReviewRepository {
  getReviews(): Promise<Review[]>;
  getReviewById(id: string): Promise<Review | null>;
  getReviewsByAppointment(appointmentId: string): Promise<Review[]>;
  getReviewsByClient(clientId: string): Promise<Review[]>;
  getReviewsByStaff(staffId: string): Promise<Review[]>;
  getRatingStats(): Promise<RatingStats[]>;
  createReview(data: CreateReviewData): Promise<Review>;
  updateReview(id: string, data: UpdateReviewData): Promise<Review>;
  deleteReview(id: string): Promise<void>;
}