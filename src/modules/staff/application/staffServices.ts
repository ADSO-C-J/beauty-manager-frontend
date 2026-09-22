import { StaffApiRepository } from '../infrastructure/repository/StaffApiRepository';
import type { StaffRepository } from '../domain/ports/StaffRepository';
import type { Stylist } from '../domain/models/Stylist';

const repository: StaffRepository = new StaffApiRepository();

export const staffService = {
  getStylists: (): Promise<Stylist[]> => repository.getStylists(),
  getStylistById: (id: string): Promise<Stylist | null> => repository.getStylistById(id),
};
