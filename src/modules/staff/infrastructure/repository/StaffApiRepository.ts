import { axiosClient } from '@shared/http/axiosClient';
import type { Stylist } from '../../domain/models/Stylist';
import type { StaffRepository } from '../../domain/ports/StaffRepository';

interface ApiStylist {
  id: string;
  staffId?: string;
  name: string;
  specialty?: string;
  avatarUrl?: string;
}
export class StaffApiRepository implements StaffRepository {
  async getStylists(): Promise<Stylist[]> {
    const { data } = await axiosClient.get<ApiStylist[]>('/stylists');
    return (data ?? []).map((s) => ({
      id: s.id,
      staffId: s.staffId,
      name: s.name,
      specialty: s.specialty,
      avatar: s.avatarUrl,
      avatarUrl: s.avatarUrl,
    }));
  }
  async getStylistById(id: string): Promise<Stylist | null> {
    try {
      const { data } = await axiosClient.get<ApiStylist>(`/stylists/${id}`);
      return {
        id: data.id,
        staffId: data.staffId,
        name: data.name,
        specialty: data.specialty,
        avatar: data.avatarUrl,
        avatarUrl: data.avatarUrl,
      };
    } catch {
      return null;
    }
  }
}
