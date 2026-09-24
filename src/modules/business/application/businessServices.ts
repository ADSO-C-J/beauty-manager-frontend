import { BusinessApiRepository } from '../infrastructure/repository/BusinessApiRepository';
import type {
  BusinessRepository,
  UpdateBusinessData,
  UpsertBusinessHoursData,
} from '../domain/ports/BusinessRepository';
import type { NotificationPreferences } from '../domain/models/Business';

const repository: BusinessRepository = new BusinessApiRepository();

export const businessService = {
  getBusiness: () => repository.getBusiness(),
  updateBusiness: (data: UpdateBusinessData) => repository.updateBusiness(data),
  getBusinessHours: (businessId: string) =>
    repository.getBusinessHours(businessId),
  upsertBusinessHours: (businessId: string, data: UpsertBusinessHoursData) =>
    repository.upsertBusinessHours(businessId, data),
  getNotificationPreferences: (userId: string) =>
    repository.getNotificationPreferences(userId),
  updateNotificationPreferences: (userId: string, data: NotificationPreferences) =>
    repository.updateNotificationPreferences(userId, data),
};