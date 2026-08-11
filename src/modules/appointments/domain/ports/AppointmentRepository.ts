import type { Appointment } from '../models/Appointment';
import type { Stylist } from '../models/Stylist';

export interface CreateAppointmentData {
  clientId: string;
  service: string;
  stylistId: string;
  date: string;
  time: string;
  notes?: string;
}

export interface AppointmentRepository {
  getAppointments(dateFrom: string, dateTo: string): Promise<Appointment[]>;
  getStylists(): Promise<Stylist[]>;
  createAppointment(data: CreateAppointmentData): Promise<Appointment>;
}