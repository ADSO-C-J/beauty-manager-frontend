export interface Appointment {
  id: string;
  date: string;      // "2026-08-09"
  time: string;      // "09:00"
  clientId: string;
  clientName: string;
  service: string;
  stylistId: string;
  stylistName: string;
  duration: string;
  status: string;
  notes?: string;
}
