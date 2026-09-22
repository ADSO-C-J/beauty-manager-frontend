import { ReviewApiRepository } from '../infrastructure/repository/ReviewApiRepository';
import type {
  ReviewRepository,
  CreateReviewData,
  UpdateReviewData,
} from '../domain/ports/ReviewRepository';

const repository: ReviewRepository = new ReviewApiRepository();

export const reviewService = {
  getReviews: () => repository.getReviews(),
  getReviewById: (id: string) => repository.getReviewById(id),
  getReviewsByAppointment: (appointmentId: string) =>
    repository.getReviewsByAppointment(appointmentId),
  getReviewsByClient: (clientId: string) => repository.getReviewsByClient(clientId),
  getReviewsByStaff: (staffId: string) => repository.getReviewsByStaff(staffId),
  getRatingStats: () => repository.getRatingStats(),
  createReview: (data: CreateReviewData) => repository.createReview(data),
  updateReview: (id: string, data: UpdateReviewData) =>
    repository.updateReview(id, data),
  deleteReview: (id: string) => repository.deleteReview(id),
};