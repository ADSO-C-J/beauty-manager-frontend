import type { Stylist } from '../models/Stylist';

export interface StaffRepository {
  getStylists(): Promise<Stylist[]>;
  getStylistById(id: string): Promise<Stylist | null>;
}
