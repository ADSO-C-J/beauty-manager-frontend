// Días de la semana soportados por el backend (enum DayOfWeek, en minúsculas y sin tilde)
export type ScheduleDay =
  | 'lunes'
  | 'martes'
  | 'miercoles'
  | 'jueves'
  | 'viernes'
  | 'sabado'
  | 'domingo';

export interface StaffSchedule {
  id: string;
  staffId: string;
  day: ScheduleDay;
  startsAt: string; // "HH:mm:ss" que devuelve el backend
  endsAt: string;   // "HH:mm:ss"
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}