import {
  Plus,
  Filter,
  Search,
  X,
  DollarSign,
  CreditCard,
  CalendarDays,
  Hash,
} from 'lucide-react';
import { Button } from '@components/button';
import { Card, CardContent } from '@components/card';
import { Badge } from '@components/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@components/dialog';
import { Input } from '@components/input';
import { Label } from '@components/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/select';
import type { PaymentMethod, PaymentStatus } from '@modules/payments/domain/models/Payment';
import {
  usePaymentsPresenter,
  methodLabels,
  statusLabels,
} from './usePaymentsPresenter';

const statusColors: Record<PaymentStatus, string> = {
  pagado: 'bg-[#48BB78] text-white',
  pendiente: 'bg-[#ECC94B] text-[#2D3748]',
  reembolsado: 'bg-[#4299E1] text-white',
  fallido: 'bg-[#F56565] text-white',
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(value);

const formatDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }) : '—';

interface AppointmentOption {
  id: string;
  label: string;
}

// Muestra la descripción legible de la cita; cae al ID corto si no está en las opciones.
const appointmentLabel = (appointmentId: string, options: AppointmentOption[]) =>
  options.find((o) => o.id === appointmentId)?.label ??
  `Cita #${appointmentId.slice(0, 8)}`;

const Payments = () => {
  const {
    isLoading,
    error,
    clearError,
    appointmentOptions,
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
    deletePayment,
    filteredPayments,
    totalPaid,
    totalPending,
  } = usePaymentsPresenter();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#2D3748]">Pagos</h2>
          <p className="text-[#4A5568] mt-1">Registra y administra los pagos de las citas</p>
        </div>
        <Button
          className="bg-[#4A5568] hover:bg-[#2D3748] w-full sm:w-auto"
          onClick={() => setOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Registrar pago
        </Button>

        <Dialog
          open={open}
          onOpenChange={(isOpen) => {
            if (!isOpen) handleClose();
          }}
        >
          <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Registrar nuevo pago</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="appointmentId">Cita</Label>
                <Select
                  value={form.appointmentId}
                  onValueChange={(v) => setForm({ ...form, appointmentId: v })}
                >
                  <SelectTrigger id="appointmentId">
                    <SelectValue placeholder="Selecciona una cita" />
                  </SelectTrigger>
                  <SelectContent>
                    {appointmentOptions.length === 0 && (
                      <div className="px-2 py-1.5 text-sm text-[#718096]">
                        No hay citas disponibles
                      </div>
                    )}
                    {appointmentOptions.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.appointmentId && (
                  <p className="text-red-500 text-xs mt-1">{errors.appointmentId}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Monto</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  />
                  {errors.amount && (
                    <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="method">Método de pago</Label>
                  <Select
                    value={form.method}
                    onValueChange={(v) => setForm({ ...form, method: v as PaymentMethod })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona método" />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(methodLabels) as PaymentMethod[]).map((m) => (
                        <SelectItem key={m} value={m}>
                          {methodLabels[m]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="reference">Referencia (opcional)</Label>
                <Input
                  id="reference"
                  placeholder="Nº de transacción, recibo..."
                  value={form.reference}
                  onChange={(e) => setForm({ ...form, reference: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="notes">Notas (opcional)</Label>
                <Input
                  id="notes"
                  placeholder="Notas adicionales..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button type="submit" className="flex-1 bg-[#4A5568] hover:bg-[#2D3748]">
                  Registrar pago
                </Button>
                <Button type="button" variant="outline" className="flex-1" onClick={handleClose}>
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-[#48BB78]/10">
              <DollarSign className="w-6 h-6 text-[#48BB78]" />
            </div>
            <div>
              <p className="text-sm text-[#718096]">Total cobrado</p>
              <p className="text-xl font-bold text-[#2D3748]">{formatCurrency(totalPaid)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-[#ECC94B]/10">
              <DollarSign className="w-6 h-6 text-[#D69E2E]" />
            </div>
            <div>
              <p className="text-sm text-[#718096]">Pendiente de cobro</p>
              <p className="text-xl font-bold text-[#2D3748]">{formatCurrency(totalPending)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-[#A0AEC0]" />
          <Input
            placeholder="Buscar por cita, referencia o método..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          value={filterStatus}
          onValueChange={(v) => setFilterStatus(v as PaymentStatus | 'all')}
        >
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            {(Object.keys(statusLabels) as PaymentStatus[]).map((s) => (
              <SelectItem key={s} value={s}>
                {statusLabels[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && (
        <div
          className="flex items-center justify-between rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600"
          onClick={clearError}
        >
          {error}
          <X className="w-4 h-4 cursor-pointer" />
        </div>
      )}

      <div className="grid gap-4">
        {isLoading && <p className="text-sm text-[#718096]">Cargando pagos...</p>}
        {!isLoading && filteredPayments.length === 0 && (
          <p className="text-sm text-[#718096]">No hay pagos registrados.</p>
        )}
        {filteredPayments.map((payment) => (
          <Card key={payment.id}>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center justify-center bg-[#4A5568] text-white rounded-lg p-3 w-20 shrink-0">
                    <DollarSign className="w-4 h-4 mb-1" />
                    <span className="text-sm font-semibold text-center">
                      {formatCurrency(payment.amount)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#2D3748]">
                      {methodLabels[payment.method]}
                    </h3>
                    <p className="text-sm text-[#718096]">
                      {appointmentLabel(payment.appointmentId, appointmentOptions)}
                    </p>
                    <p className="text-xs text-[#A0AEC0]">{formatDate(payment.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:ml-auto">
                  <Badge className={statusColors[payment.status]}>
                    {statusLabels[payment.status]}
                  </Badge>
                  <Button variant="outline" size="sm" onClick={() => setDetailPayment(payment)}>
                    Ver detalles
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal detalle */}
      {detailPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-semibold text-[#2D3748]">Detalle del pago</h3>
              <button
                onClick={() => setDetailPayment(null)}
                className="text-[#718096] hover:text-[#2D3748]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Badge className={statusColors[detailPayment.status]}>
                  {statusLabels[detailPayment.status]}
                </Badge>
                <span className="text-sm text-[#718096]">
                  #{detailPayment.id.slice(0, 8)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4 text-[#718096]" />
                    <p className="text-xs text-[#718096]">Monto</p>
                  </div>
                  <p className="text-sm font-semibold text-[#2D3748]">
                    {formatCurrency(detailPayment.amount)}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <CreditCard className="w-4 h-4 text-[#718096]" />
                    <p className="text-xs text-[#718096]">Método</p>
                  </div>
                  <p className="text-sm font-semibold text-[#2D3748]">
                    {methodLabels[detailPayment.method]}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Hash className="w-4 h-4 text-[#718096]" />
                    <p className="text-xs text-[#718096]">Referencia</p>
                  </div>
                  <p className="text-sm font-semibold text-[#2D3748]">
                    {detailPayment.reference ?? '—'}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <CalendarDays className="w-4 h-4 text-[#718096]" />
                    <p className="text-xs text-[#718096]">Fecha de pago</p>
                  </div>
                  <p className="text-sm font-semibold text-[#2D3748]">
                    {formatDate(detailPayment.paidAt ?? detailPayment.createdAt)}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-[#718096] mb-1">Cita</p>
                <p className="text-sm font-semibold text-[#2D3748] break-all">
                  {appointmentLabel(detailPayment.appointmentId, appointmentOptions)}
                </p>
              </div>

              {detailPayment.notes && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-[#718096] mb-1">Notas</p>
                  <p className="text-sm text-[#2D3748]">{detailPayment.notes}</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                {detailPayment.status !== 'pagado' && (
                  <Button
                    className="flex-1 bg-[#48BB78] hover:bg-[#38A169] text-white"
                    onClick={() => void changeStatus(detailPayment, 'pagado')}
                  >
                    Marcar pagado
                  </Button>
                )}
                {detailPayment.status !== 'reembolsado' && (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => void changeStatus(detailPayment, 'reembolsado')}
                  >
                    Reembolsar
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="flex-1 border-red-300 text-red-500 hover:bg-red-50"
                  onClick={() => void deletePayment(detailPayment.id)}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;