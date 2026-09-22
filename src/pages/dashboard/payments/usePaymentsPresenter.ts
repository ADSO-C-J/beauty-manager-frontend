import { useCallback, useEffect, useMemo, useState } from 'react';
import { paymentService } from '@modules/payments/application/paymentServices';
import { appointmentService } from '@modules/appointments/application/appointmentServices';
import type { Appointment } from '@modules/appointments/domain/models/Appointment';
import type {
  Payment,
  PaymentMethod,
  PaymentStatus,
} from '@modules/payments/domain/models/Payment';

export interface PaymentForm {
  appointmentId: string;
  amount: string;
  method: PaymentMethod;
  reference: string;
  notes: string;
}

export interface PaymentFormErrors {
  appointmentId?: string;
  amount?: string;
}

const emptyForm: PaymentForm = {
  appointmentId: '',
  amount: '',
  method: 'efectivo',
  reference: '',
  notes: '',
};

export const methodLabels: Record<PaymentMethod, string> = {
  efectivo: 'Efectivo',
  tarjeta_credito: 'Tarjeta crédito',
  tarjeta_debito: 'Tarjeta débito',
  transferencia: 'Transferencia',
  otro: 'Otro',
};

export const statusLabels: Record<PaymentStatus, string> = {
  pendiente: 'Pendiente',
  pagado: 'Pagado',
  reembolsado: 'Reembolsado',
  fallido: 'Fallido',
};

// Rango amplio para poblar el selector de citas: desde 2 años atrás hasta 1 año adelante.
// El backend exige LocalDateTime ISO completo (YYYY-MM-DDThh:mm:ss), no solo la fecha.
function appointmentRange(): { dateFrom: string; dateTo: string } {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const day = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const from = new Date(now.getFullYear() - 2, 0, 1);
  const to = new Date(now.getFullYear() + 1, 11, 31);
  return { dateFrom: `${day(from)}T00:00:00`, dateTo: `${day(to)}T23:59:59` };
}

export function usePaymentsPresenter() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<PaymentStatus | 'all'>('all');

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<PaymentForm>(emptyForm);
  const [errors, setErrors] = useState<PaymentFormErrors>({});
  const [detailPayment, setDetailPayment] = useState<Payment | null>(null);

  const loadPayments = useCallback(async (isCancelled?: () => boolean) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await paymentService.getPayments();
      if (isCancelled?.()) return;
      setPayments(data);
    } catch {
      if (isCancelled?.()) return;
      setError('No se pudieron cargar los pagos');
    } finally {
      if (!isCancelled?.()) setIsLoading(false);
    }
  }, []);

  const loadAppointments = useCallback(async (isCancelled?: () => boolean) => {
    try {
      const { dateFrom, dateTo } = appointmentRange();
      const data = await appointmentService.getAppointments(dateFrom, dateTo);
      if (isCancelled?.()) return;
      setAppointments(data);
    } catch {
      // El selector de citas queda vacío si la carga falla; no bloquea la página.
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const isCancelled = () => cancelled;
    // Diferido para evitar setState sincrónico dentro del effect (patrón del proyecto).
    Promise.resolve()
      .then(() => loadPayments(isCancelled))
      .then(() => loadAppointments(isCancelled))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [loadPayments, loadAppointments]);

  // Recarga los pagos (para refrescar tras registrar uno nuevo).
  const reload = useCallback(async () => {
    await loadPayments();
  }, [loadPayments]);

  // Opciones legibles para el selector de citas (cliente + fecha/hora + servicio).
  const appointmentOptions = useMemo(
    () =>
      appointments.map((apt) => ({
        id: apt.id,
        label: `${apt.clientName || 'Cliente'} — ${apt.date} ${apt.time}${
          apt.service ? ` (${apt.service})` : ''
        }`,
      })),
    [appointments]
  );

  const handleClose = () => {
    setOpen(false);
    setForm(emptyForm);
    setErrors({});
  };

  const validate = (): boolean => {
    const next: PaymentFormErrors = {};
    if (!form.appointmentId.trim()) next.appointmentId = 'El ID de la cita es obligatorio';
    const amount = Number(form.amount);
    if (!form.amount.trim() || Number.isNaN(amount) || amount <= 0) {
      next.amount = 'Ingresa un monto mayor a 0';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await paymentService.createPayment({
        appointmentId: form.appointmentId.trim(),
        amount: Number(form.amount),
        method: form.method,
        reference: form.reference.trim() || undefined,
        notes: form.notes.trim() || undefined,
      });
      handleClose();
      await reload();
    } catch {
      setError('No se pudo registrar el pago');
    }
  };

  const changeStatus = async (payment: Payment, status: PaymentStatus) => {
    try {
      const updated = await paymentService.updatePayment(payment.id, {
        amount: payment.amount,
        method: payment.method,
        status,
        reference: payment.reference,
        notes: payment.notes,
      });
      setPayments((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setDetailPayment((prev) => (prev && prev.id === updated.id ? updated : prev));
    } catch {
      setError('No se pudo actualizar el pago');
    }
  };

  const destructiveDelete = async (id: string) => {
    try {
      await paymentService.deletePayment(id);
      setPayments((prev) => prev.filter((p) => p.id !== id));
      setDetailPayment(null);
    } catch {
      setError('No se pudo eliminar el pago');
    }
  };

  const filteredPayments = payments.filter((p) => {
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    const term = searchTerm.trim().toLowerCase();
    const matchesTerm =
      term === '' ||
      p.appointmentId.toLowerCase().includes(term) ||
      (p.reference ?? '').toLowerCase().includes(term) ||
      methodLabels[p.method].toLowerCase().includes(term);
    return matchesStatus && matchesTerm;
  });

  const totalPaid = payments
    .filter((p) => p.status === 'pagado')
    .reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments
    .filter((p) => p.status === 'pendiente')
    .reduce((sum, p) => sum + p.amount, 0);

  return {
    payments,
    appointments,
    appointmentOptions,
    isLoading,
    error,
    clearError: () => setError(null),
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    open,
    setOpen,
    form,
    setForm,
    errors,
    detailPayment,
    setDetailPayment,
    handleClose,
    handleSubmit,
    changeStatus,
    deletePayment: destructiveDelete,
    reload,
    filteredPayments,
    totalPaid,
    totalPending,
  };
}