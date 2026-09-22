import { axiosClient } from '@shared/http/axiosClient';
import type { Payment, PaymentStatus } from '../../domain/models/Payment';
import type {
  PaymentRepository,
  CreatePaymentData,
  UpdatePaymentData,
} from '../../domain/ports/PaymentRepository';
import { toPayment, type ApiPayment } from '../mappers/paymentMapper';

export class PaymentApiRepository implements PaymentRepository {
  async getPayments(): Promise<Payment[]> {
    const { data } = await axiosClient.get<ApiPayment[]>('/payments');
    return (data ?? []).map(toPayment);
  }

  async getPaymentById(id: string): Promise<Payment | null> {
    try {
      const { data } = await axiosClient.get<ApiPayment>(`/payments/${id}`);
      return toPayment(data);
    } catch {
      return null;
    }
  }

  async getPaymentsByAppointment(appointmentId: string): Promise<Payment[]> {
    const { data } = await axiosClient.get<ApiPayment[]>(
      `/payments/appointment/${appointmentId}`
    );
    return (data ?? []).map(toPayment);
  }

  async getPaymentsByStatus(status: PaymentStatus): Promise<Payment[]> {
    const { data } = await axiosClient.get<ApiPayment[]>(`/payments/status/${status}`);
    return (data ?? []).map(toPayment);
  }

  async createPayment(data: CreatePaymentData): Promise<Payment> {
    const { data: response } = await axiosClient.post<ApiPayment>('/payments', {
      appointmentId: data.appointmentId,
      amount: data.amount,
      method: data.method,
      reference: data.reference,
      notes: data.notes,
    });
    return toPayment(response);
  }

  async updatePayment(id: string, data: UpdatePaymentData): Promise<Payment> {
    const { data: response } = await axiosClient.put<ApiPayment>(`/payments/${id}`, {
      amount: data.amount,
      method: data.method,
      status: data.status,
      reference: data.reference,
      notes: data.notes,
    });
    return toPayment(response);
  }

  async deletePayment(id: string): Promise<void> {
    await axiosClient.delete(`/payments/${id}`);
  }
}