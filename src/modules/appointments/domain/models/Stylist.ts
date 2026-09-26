export interface Stylist {
  id: string;
  /** Id del registro de staff (staff.id). Es el que usan los endpoints /api/staff/{staffId}/... */
  staffId?: string;
  name: string;
  specialty?: string;
  avatar?: string;
  avatarUrl?: string;
}
