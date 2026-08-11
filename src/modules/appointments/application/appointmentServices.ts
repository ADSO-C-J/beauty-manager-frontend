import { AppointmentApiRepository } from '../infrastructure/repository/AppointmentApiRepository';
import type { AppointmentRepository, CreateAppointmentData } from '../domain/ports/AppointmentRepository';

const repository: AppointmentRepository = new AppointmentApiRepository();

export const appointmentService = {
  getAppointments: (dateFrom: string, dateTo: string) =>
    repository.getAppointments(dateFrom, dateTo),
  getStylists: () => repository.getStylists(),
  createAppointment: (data: CreateAppointmentData) =>
    repository.createAppointment(data),
};