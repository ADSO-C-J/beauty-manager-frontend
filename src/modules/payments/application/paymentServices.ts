import { PaymentApiRepository } from '../infrastructure/repository/PaymentApiRepository';
import type {
  PaymentRepository,
  CreatePaymentData,
  UpdatePaymentData,
} from '../domain/ports/PaymentRepository';
import type { PaymentStatus } from '../domain/models/Payment';

const repository: PaymentRepository = new PaymentApiRepository();

export const paymentService = {
  getPayments: () => repository.getPayments(),
  getPaymentById: (id: string) => repository.getPaymentById(id),
  getPaymentsByAppointment: (appointmentId: string) =>
    repository.getPaymentsByAppointment(appointmentId),
  getPaymentsByStatus: (status: PaymentStatus) =>
    repository.getPaymentsByStatus(status),
  createPayment: (data: CreatePaymentData) => repository.createPayment(data),
  updatePayment: (id: string, data: UpdatePaymentData) =>
    repository.updatePayment(id, data),
  deletePayment: (id: string) => repository.deletePayment(id),
};