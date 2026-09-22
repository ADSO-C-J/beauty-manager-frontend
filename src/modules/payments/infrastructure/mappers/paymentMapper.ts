import type { Payment } from '../../domain/models/Payment';

// Estructura que devuelve el backend (PaymentResponseDTO)
export interface ApiPayment {
  id: string;
  appointmentId: string;
  amount: number | string;
  method: string;
  status: string;
  reference?: string;
  notes?: string;
  createdBy?: string;
  paidAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export function toPayment(api: ApiPayment): Payment {
  return {
    id: api.id,
    appointmentId: api.appointmentId,
    amount: typeof api.amount === 'number' ? api.amount : Number(api.amount),
    method: api.method as Payment['method'],
    status: api.status as Payment['status'],
    reference: api.reference,
    notes: api.notes,
    createdBy: api.createdBy,
    paidAt: api.paidAt,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
  };
}