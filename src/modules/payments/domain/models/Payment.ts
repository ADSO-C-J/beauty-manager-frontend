// Métodos de pago soportados por el backend (enum PaymentMethod)
export type PaymentMethod =
  | 'efectivo'
  | 'tarjeta_credito'
  | 'tarjeta_debito'
  | 'transferencia'
  | 'otro';

// Estados del pago (enum PaymentStatus)
export type PaymentStatus = 'pendiente' | 'pagado' | 'reembolsado' | 'fallido';

export interface Payment {
  id: string;
  appointmentId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  reference?: string;
  notes?: string;
  createdBy?: string;
  paidAt?: string;
  createdAt?: string;
  updatedAt?: string;
}