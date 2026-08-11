import { axiosClient } from '@shared/http/axiosClient';
import type { Appointment } from '../../domain/models/Appointment';
import type { Stylist } from '../../domain/models/Stylist';
import type { AppointmentRepository, CreateAppointmentData } from '../../domain/ports/AppointmentRepository';

// Estructura que devuelve el backend
interface ApiAppointment {
  id: string;
  clientId: string;
  clientName?: string;
  stylistId: string;
  stylistName?: string;
  service?: string;
  scheduledAt: string; // ISO DateTime
  endsAt: string;
  status: string;
  notes?: string;
}

interface ApiStylist {
  id: string;
  name: string;
  specialty?: string;
  avatarUrl?: string;
}

function toAppointment(api: ApiAppointment): Appointment {
  // scheduledAt: "2026-08-09T09:00:00" -> date "2026-08-09", time "09:00"
  const dt = new Date(api.scheduledAt);
  const pad = (n: number) => n.toString().padStart(2, '0');
  const date = `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
  const time = `${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
  return {
    id: api.id,
    date,
    time,
    clientId: api.clientId,
    clientName: api.clientName ?? '',
    service: api.service ?? '',
    stylistId: api.stylistId,
    stylistName: api.stylistName ?? '',
    duration: '1h',
    status: api.status,
    notes: api.notes,
  };
}

export class AppointmentApiRepository implements AppointmentRepository {
  async getAppointments(dateFrom: string, dateTo: string): Promise<Appointment[]> {
    const { data } = await axiosClient.get('/appointments', {
      params: { dateFrom, dateTo },
    });
    return (data as ApiAppointment[]).map(toAppointment);
  }

  async getStylists(): Promise<Stylist[]> {
    const { data } = await axiosClient.get('/stylists');
    return (data as ApiStylist[]).map((s) => ({
      id: s.id,
      name: s.name,
      specialty: s.specialty,
      avatar: s.avatarUrl,
      avatarUrl: s.avatarUrl,
    }));
  }

  async createAppointment(data: CreateAppointmentData): Promise<Appointment> {
    const { data: response } = await axiosClient.post('/appointments', {
      clientId: data.clientId,
      staffId: data.stylistId,
      service: data.service,
      date: data.date,
      time: data.time,
      notes: data.notes,
    });
    return toAppointment(response as ApiAppointment);
  }
}