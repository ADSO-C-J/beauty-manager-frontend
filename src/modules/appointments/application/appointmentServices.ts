import { AppointmentApiRepository } from '../infrastructure/repository/AppointmentApiRepository';
import type {
  AppointmentRepository,
  CreateAppointmentData,
  UpdateAppointmentData,
} from '../domain/ports/AppointmentRepository';
import { staffService } from '@modules/staff/application/staffServices';

const repository: AppointmentRepository = new AppointmentApiRepository();

export const appointmentService = {
  getAppointments: (dateFrom: string, dateTo: string) =>
    repository.getAppointments(dateFrom, dateTo),
  // Delegate stylist listing to the staff module to have a single source of truth
  getStylists: () => staffService.getStylists(),
  createAppointment: (data: CreateAppointmentData) =>
    repository.createAppointment(data),
  updateAppointment: (id: string, data: UpdateAppointmentData) =>
    repository.updateAppointment(id, data),
  deleteAppointment: (id: string) => repository.deleteAppointment(id),
};