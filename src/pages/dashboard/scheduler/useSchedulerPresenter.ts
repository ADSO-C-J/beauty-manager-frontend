import { useState, useMemo, useEffect } from "react";
import { appointmentService } from "@modules/appointments/application/appointmentServices";
import type { CreateAppointmentData } from "@modules/appointments/domain/ports/AppointmentRepository";
import type { Appointment } from "@modules/appointments/domain/models/Appointment";
import type { Stylist } from "@modules/appointments/domain/models/Stylist";

// Funciones auxiliares
/** Obtiene el lunes de la semana de una fecha dada */
function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0= domingo 1= Lunes
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Genera los 7 días de la semana (lunes a domingo) */
function getWeekDays(monday: Date): Date[] {
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    days.push(day);
  }
  return days;
}

/** Genera los slots de hora (ej: 8:00, 9:00, 10:00 ... 20:00) */
function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let hour = 8; hour <= 20; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`);
  }
  return slots;
}

/** Formatea una fecha a "YYYY-MM-DD" (hora local, sin desfase UTC) */
function formatDate(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Convierte una fecha local a "YYYY-MM-DDT00:00:00" (datetime ISO local) */
function toLocalStartOfDay(date: Date): string {
  return `${formatDate(date)}T00:00:00`;
}

/** Convertir "YYYY-MM-DD" en datetime ISO local de fin de día */
function toLocalEndOfDay(date: Date): string {
  return `${formatDate(date)}T23:59:59`;
}

/** HOOK PRINCIPAL (Presenter) */
export function useSchedulerPresenter() {
  // Estado
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedStylist, setSelectedStylist] = useState<Stylist | null>(null);
  const [currentMonday, setCurrentMonday] = useState<Date>(() => getMonday(new Date()));
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    date: string;
    time: string;
    stylistId: string;
    stylistName: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  // Cargar estilistas al montar
  useEffect(() => {
    appointmentService
      .getStylists()
      .then((data) => setStylists(data))
      .catch((err) => console.error("Error cargando estilistas:", err));
  }, []);

  // Cargar citas de la semana cuando cambia currentMonday
  useEffect(() => {
    const monday = currentMonday;
    const sundayDate = new Date(currentMonday);
    sundayDate.setDate(currentMonday.getDate() + 6);

    setLoading(true);
    appointmentService
      .getAppointments(toLocalStartOfDay(monday), toLocalEndOfDay(sundayDate))
      .then((data) => setAppointments(data))
      .catch((err) => console.error("Error cargando citas:", err))
      .finally(() => setLoading(false));
  }, [currentMonday]);

  // Valores derivados
  const weekDays = useMemo(() => getWeekDays(currentMonday), [currentMonday]);
  const timeSlots = useMemo(() => generateTimeSlots(), []);

  // Citas filtradas por el estilista seleccionado
  const filteredAppointments = useMemo(() => {
    if (!selectedStylist) return [];
    return appointments.filter((apt) => apt.stylistId === selectedStylist.id);
  }, [appointments, selectedStylist]);

  // Navegar a la semana anterior
  const goToPrevWeek = () => {
    setCurrentMonday((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 7);
      return d;
    });
  };

  // Navegar a la siguiente semana
  const goToNextWeek = () => {
    setCurrentMonday((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7);
      return d;
    });
  };

  // Ir a la semana actual
  const goToToday = () => {
    setCurrentMonday(getMonday(new Date()));
  };

  // Validación si el slot está ocupado o no
  const isSlotOccupied = (date: string, time: string): Appointment | undefined => {
    return filteredAppointments.find((apt) => apt.date === date && apt.time === time);
  };

  // Evento del click en un slot disponible
  const handleSlotClick = (date: string, time: string) => {
    if (!selectedStylist) return;
    setSelectedSlot({
      date,
      time,
      stylistId: selectedStylist.id,
      stylistName: selectedStylist.name,
    });
    setModalOpen(true);
  };

  // Agrega una nueva cita vía API
  const addAppointment = async (data: CreateAppointmentData) => {
    try {
      const created = await appointmentService.createAppointment(data);
      setAppointments((prev) => [...prev, created]);
      setModalOpen(false);
      setSelectedSlot(null);
    } catch (err) {
      console.error("Error creando cita:", err);
    }
  };

  // Cerrar el modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedSlot(null);
  };

  return {
    stylists,
    appointments,
    selectedStylist,
    currentMonday,
    weekDays,
    timeSlots,
    filteredAppointments,
    modalOpen,
    selectedSlot,
    loading,

    // Setter
    setSelectedStylist,

    goToPrevWeek,
    goToNextWeek,
    goToToday,
    isSlotOccupied,
    handleSlotClick,
    addAppointment,
    closeModal,
  };
}