import type { Payment, PaymentMethod, PaymentStatus } from '../models/Payment';

export interface CreatePaymentData {
  appointmentId: string;
  amount: number;
  method: PaymentMethod;
  reference?: string;
  notes?: string;
}

export interface UpdatePaymentData {
  amount?: number;
  method?: PaymentMethod;
  status: PaymentStatus;
  reference?: string;
  notes?: string;
}

export interface PaymentRepository {
  getPayments(): Promise<Payment[]>;
  getPaymentById(id: string): Promise<Payment | null>;
  getPaymentsByAppointment(appointmentId: string): Promise<Payment[]>;
  getPaymentsByStatus(status: PaymentStatus): Promise<Payment[]>;
  createPayment(data: CreatePaymentData): Promise<Payment>;
  updatePayment(id: string, data: UpdatePaymentData): Promise<Payment>;
  deletePayment(id: string): Promise<void>;
}