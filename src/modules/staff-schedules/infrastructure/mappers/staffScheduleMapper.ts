import type { StaffSchedule, ScheduleDay } from '../../domain/models/StaffSchedule';

// Estructura que devuelve el backend (StaffScheduleResponseDTO)
export interface ApiStaffSchedule {
  id: string;
  staffId: string;
  day: string;
  startsAt: string; // "HH:mm:ss"
  endsAt: string;   // "HH:mm:ss"
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/** Recorta "HH:mm:ss" -> "HH:mm" para los inputs de tipo time. */
export function toTimeInput(value: string): string {
  return (value ?? '').slice(0, 5);
}

/** Normaliza "HH:mm" -> "HH:mm:ss", que es lo que espera el backend (LocalTime). */
export function toApiTime(value: string): string {
  const trimmed = (value ?? '').trim();
  if (trimmed === '') return trimmed;
  return trimmed.length === 5 ? `${trimmed}:00` : trimmed;
}

export function toStaffSchedule(api: ApiStaffSchedule): StaffSchedule {
  return {
    id: api.id,
    staffId: api.staffId,
    day: api.day as ScheduleDay,
    startsAt: api.startsAt,
    endsAt: api.endsAt,
    isActive: api.isActive ?? true,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
  };
}