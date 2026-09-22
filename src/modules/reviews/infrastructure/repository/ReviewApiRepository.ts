import { axiosClient } from '@shared/http/axiosClient';
import type { Review, RatingStats } from '../../domain/models/Review';
import type {
  ReviewRepository,
  CreateReviewData,
  UpdateReviewData,
} from '../../domain/ports/ReviewRepository';
import {
  toReview,
  toRatingStats,
  type ApiReview,
  type ApiRatingStats,
} from '../mappers/reviewMapper';

export class ReviewApiRepository implements ReviewRepository {
  async getReviews(): Promise<Review[]> {
    const { data } = await axiosClient.get<ApiReview[]>('/reviews');
    return (data ?? []).map(toReview);
  }

  async getReviewById(id: string): Promise<Review | null> {
    try {
      const { data } = await axiosClient.get<ApiReview>(`/reviews/${id}`);
      return toReview(data);
    } catch {
      return null;
    }
  }

  async getReviewsByAppointment(appointmentId: string): Promise<Review[]> {
    const { data } = await axiosClient.get<ApiReview[]>(
      `/reviews/appointment/${appointmentId}`
    );
    return (data ?? []).map(toReview);
  }

  async getReviewsByClient(clientId: string): Promise<Review[]> {
    const { data } = await axiosClient.get<ApiReview[]>(`/reviews/client/${clientId}`);
    return (data ?? []).map(toReview);
  }

  async getReviewsByStaff(staffId: string): Promise<Review[]> {
    const { data } = await axiosClient.get<ApiReview[]>(`/reviews/staff/${staffId}`);
    return (data ?? []).map(toReview);
  }

  async getRatingStats(): Promise<RatingStats[]> {
    const { data } = await axiosClient.get<ApiRatingStats[]>('/reviews/rating-stats');
    return (data ?? []).map(toRatingStats);
  }

  async createReview(data: CreateReviewData): Promise<Review> {
    const { data: response } = await axiosClient.post<ApiReview>('/reviews', {
      appointmentId: data.appointmentId,
      clientId: data.clientId,
      staffId: data.staffId,
      rating: data.rating,
      comment: data.comment,
      isPublic: data.isPublic,
    });
    return toReview(response);
  }

  async updateReview(id: string, data: UpdateReviewData): Promise<Review> {
    const { data: response } = await axiosClient.put<ApiReview>(`/reviews/${id}`, {
      rating: data.rating,
      comment: data.comment,
      isPublic: data.isPublic,
    });
    return toReview(response);
  }

  async deleteReview(id: string): Promise<void> {
    await axiosClient.delete(`/reviews/${id}`);
  }
}