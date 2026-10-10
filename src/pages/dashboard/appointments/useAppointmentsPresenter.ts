import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useAuthStore } from "@modules/auth/application/state/authStore";
import { appointmentService } from "@modules/appointments/application/appointmentServices";
import { scopeAppointmentsToUser } from "@modules/appointments/application/appointmentScope";
import { serviceService } from "@modules/services/application/serviceServices";
import { staffService } from "@modules/staff/application/staffServices";
import { clientService } from "@modules/clients/application/clientServices";
import type { Appointment } from "@modules/appointments/domain/models/Appointment";
import type { Service } from "@modules/services/domain/models/Service";
import type { Stylist } from "@modules/appointments/domain/models/Stylist";
import type { Client } from "@modules/clients/domain/models/Client";

// La página trabaja con un modelo de vista propio (nombres en lugar de ids).
export type AppointmentView = {
  id: string;
  date: string;
  time: string;
  clientId: string;
  client: string;
  service: string;
  stylistId: string;
  stylist: string;
  duration: string;
  status: string;
  notes?: string;
};

/** Convierte minutos a un texto legible: 45 -> "45min", 90 -> "1.5h", 120 -> "2h" */
function formatDuration(minutes: number): string {
  if (!minutes || minutes <= 0) return "—";
  if (minutes < 60) return `${minutes}min`;
  const hours = minutes / 60;
  return `${Number.isInteger(hours) ? hours : hours.toFixed(1)}h`;
}

/** Rango amplio (2 años atrás / 1 año adelante) para traer las citas visibles en la página. */
function appointmentRange(): { dateFrom: string; dateTo: string } {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const day = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const from = new Date(now.getFullYear() - 2, 0, 1);
  const to = new Date(now.getFullYear() + 1, 11, 31);
  return { dateFrom: `${day(from)}T00:00:00`, dateTo: `${day(to)}T23:59:59` };
}

const emptyForm = {
  client: "",
  clientId: "",
  service: "",
  stylist: "",
  time: "",
  notes: "",
};

/** Extrae el mensaje que devuelve el backend (o uno genérico si no hay). */
function apiErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === "object" && error !== null) {
    const anyError = error as {
      response?: { data?: { message?: string } };
    };
    return anyError.response?.data?.message ?? fallback;
  }
  return fallback;
}

export const useAppointmentsPresenter = () => {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const [appointmentList, setAppointmentList] = useState<AppointmentView[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [open, setOpen] = useState(!!location.state?.clientName);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState(
    location.state?.clientName
      ? {
          ...emptyForm,
          client: location.state.clientName as string,
          clientId: (location.state.clientId as string) ?? "",
        }
      : emptyForm,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [detailApt, setDetailApt] = useState<AppointmentView | null>(null);
  // Modo del formulario: crear (null) o editar una cita existente (id).
  const [editingId, setEditingId] = useState<string | null>(null);
  // Confirmación de borrado: guarda la cita pendiente de eliminar.
  const [pendingDelete, setPendingDelete] = useState<AppointmentView | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Catálogos (servicios, estilistas, clientes) para los selectores.
  const loadCatalogs = useCallback(async (isCancelled?: () => boolean) => {
    const [servicesRes, stylistsRes, clientsRes] = await Promise.allSettled([
      serviceService.getServices(),
      staffService.getStylists(),
      clientService.searchClients(""),
    ]);
    if (isCancelled?.()) return;
    if (servicesRes.status === "fulfilled") setServices(servicesRes.value);
    if (stylistsRes.status === "fulfilled") setStylists(stylistsRes.value);
    if (clientsRes.status === "fulfilled") setClients(clientsRes.value);
  }, []);

  // Citas del backend.
  const loadAppointments = useCallback(async (isCancelled?: () => boolean) => {
    setIsLoading(true);
    setError(null);
    try {
      const { dateFrom, dateTo } = appointmentRange();
      const data = await appointmentService.getAppointments(dateFrom, dateTo);
      if (isCancelled?.()) return;
      // El endpoint devuelve TODAS las citas del negocio: clientes y estilistas
      // solo deben ver las suyas (administrador y recepción ven todas).
      const visible = await scopeAppointmentsToUser(data, user);
      if (isCancelled?.()) return;
      setAppointmentList(visible.map(toView));
    } catch {
      if (isCancelled?.()) return;
      setError("No se pudieron cargar las citas");
    } finally {
      if (!isCancelled?.()) setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    let cancelled = false;
    const isCancelled = () => cancelled;
    // Diferido para evitar setState sincrónico dentro del effect (patrón del proyecto).
    Promise.resolve()
      .then(() => loadCatalogs(isCancelled))
      .then(() => loadAppointments(isCancelled))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [loadCatalogs, loadAppointments]);

  const reload = useCallback(async () => {
    await loadAppointments();
  }, [loadAppointments]);

  const handleClose = () => {
    setOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
  };

  /** Abre el formulario en modo creación (limpio). */
  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
    setDate(new Date());
    setOpen(true);
  };

  /** Abre el formulario en modo edición con los datos de la cita seleccionada. */
  const openEdit = (apt: AppointmentView) => {
    setEditingId(apt.id);
    setForm({
      client: apt.client,
      clientId: apt.clientId,
      service: apt.service,
      stylist: apt.stylist,
      time: apt.time,
      notes: apt.notes ?? "",
    });
    setDate(apt.date ? new Date(apt.date + "T00:00:00") : new Date());
    setErrors({});
    setDetailApt(null);
    setOpen(true);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.clientId) e.client = "Selecciona un cliente";
    if (!form.service) e.service = "Selecciona un servicio";
    if (!form.stylist) e.stylist = "Selecciona un estilista";
    if (!form.time) e.time = "Selecciona una hora";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const selectedStylist = stylists.find((s) => s.name === form.stylist);
    if (!selectedStylist) {
      setError("Estilista no válido");
      return;
    }

    // El POST de citas exige el staff.id (tabla staff), no el user.id. /stylists
    // devuelve ambos: `id` (user) y `staffId` (staff). Se usa staffId y, si el
    // backend no lo enviara, se cae a `id` como último recurso.
    const staffId = selectedStylist.staffId ?? selectedStylist.id;

    setIsSaving(true);
    setError(null);
    try {
      const payload = {
        clientId: form.clientId,
        service: form.service,
        stylistId: staffId,
        date: date ? date.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        time: form.time,
        notes: form.notes.trim() || undefined,
      };

      if (editingId) {
        // Actualización completa (PUT): mantiene el estado actual de la cita.
        const current = appointmentList.find((a) => a.id === editingId);
        const updated = await appointmentService.updateAppointment(editingId, {
          ...payload,
          status: current?.status ?? "pendiente",
        });
        setAppointmentList((prev) =>
          prev.map((a) => (a.id === editingId ? toView(updated) : a)),
        );
        setDetailApt((prev) => (prev && prev.id === editingId ? toView(updated) : prev));
      } else {
        const created = await appointmentService.createAppointment(payload);
        setAppointmentList((prev) => [...prev, toView(created)]);
      }
      handleClose();
    } catch (error) {
      // Cierra el modal para que el mensaje de error de la página no quede oculto
      // detrás del diálogo. El error se conserva (handleClose no lo limpia).
      handleClose();
      setError(
        apiErrorMessage(
          error,
          editingId
            ? "No se pudo actualizar la cita (revisa cliente y estilista)"
            : "No se pudo crear la cita (revisa cliente y estilista)",
        ),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const changeStatus = async (id: string, status: string) => {
    const current = appointmentList.find((a) => a.id === id);
    if (!current) return;
    // Actualización optimista.
    setAppointmentList((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    setDetailApt((prev) => (prev?.id === id ? { ...prev, status } : prev));
    try {
      await appointmentService.updateAppointment(id, {
        stylistId: current.stylistId,
        service: current.service,
        date: current.date,
        time: current.time,
        status,
        notes: current.notes,
      });
    } catch {
      // Revertir si falla.
      setAppointmentList((prev) => prev.map((a) => (a.id === id ? { ...a, status: current.status } : a)));
      setDetailApt((prev) => (prev?.id === id ? { ...prev, status: current.status } : prev));
      setError("No se pudo actualizar el estado de la cita");
    }
  };

  /** Abre el diálogo de confirmación de borrado para una cita. */
  const requestDelete = (apt: AppointmentView) => {
    setPendingDelete(apt);
  };

  const cancelDelete = () => {
    setPendingDelete(null);
  };

  /** Elimina la cita pendiente de confirmación (DELETE /appointments/{id}). */
  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const target = pendingDelete;
    setIsDeleting(true);
    setError(null);
    try {
      await appointmentService.deleteAppointment(target.id);
      setAppointmentList((prev) => prev.filter((a) => a.id !== target.id));
      setDetailApt((prev) => (prev && prev.id === target.id ? null : prev));
      setPendingDelete(null);
    } catch (err) {
      setPendingDelete(null);
      setError(apiErrorMessage(err, "No se pudo eliminar la cita"));
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredAppointments = appointmentList.filter((apt) => {
    const matchesStatus = filterStatus === "all" || apt.status === filterStatus;
    const term = searchTerm.trim().toLowerCase();
    const matchesSearch =
      term === "" ||
      apt.client.toLowerCase().includes(term) ||
      apt.service.toLowerCase().includes(term);
    return matchesStatus && matchesSearch;
  });

  const todayStr = new Date().toISOString().split("T")[0];
  const todayAppointments = filteredAppointments.filter((apt) => apt.date === todayStr);

  return {
    date,
    open,
    form,
    errors,
    setForm,
    setOpen,
    setDate,
    services,
    stylists,
    clients,
    isLoading,
    isSaving,
    error,
    clearError: () => setError(null),
    detailApt,
    searchTerm,
    handleClose,
    openCreate,
    openEdit,
    editingId,
    pendingDelete,
    isDeleting,
    requestDelete,
    cancelDelete,
    confirmDelete,
    filterStatus,
    setDetailApt,
    handleSubmit,
    changeStatus,
    setSearchTerm,
    setFilterStatus,
    todayAppointments,
    filteredAppointments,
    reload,
  };
};

/** Mapea la cita del backend al modelo de vista de la página. */
function toView(apt: Appointment): AppointmentView {
  return {
    id: apt.id,
    date: apt.date,
    time: apt.time,
    clientId: apt.clientId,
    client: apt.clientName || "Cliente",
    service: apt.service || "Servicio",
    stylistId: apt.stylistId,
    stylist: apt.stylistName || "Sin asignar",
    duration: formatDuration(parseDurationToMinutes(apt.duration)),
    status: apt.status,
    notes: apt.notes,
  };
}

/** El backend puede enviar la duración como "60", "60min", "1h"... la normalizamos a minutos. */
function parseDurationToMinutes(input: string): number {
  const value = (input ?? "").trim().toLowerCase();
  if (!value) return 60;
  if (/^\d+$/.test(value)) return Number(value);
  const hoursMatch = value.match(/^(\d+(?:\.\d+)?)\s*h/);
  if (hoursMatch) return Math.round(Number(hoursMatch[1]) * 60);
  const minMatch = value.match(/^(\d+(?:\.\d+)?)\s*min/);
  if (minMatch) return Math.round(Number(minMatch[1]));
  return 60;
}