import { useCallback, useEffect, useMemo, useState } from 'react';
import { staffScheduleService } from '@modules/staff-schedules/application/staffScheduleServices';
import type {
  StaffSchedule,
  ScheduleDay,
} from '@modules/staff-schedules/domain/models/StaffSchedule';
import { toTimeInput } from '@modules/staff-schedules/infrastructure/mappers/staffScheduleMapper';
import { staffService } from '@modules/staff/application/staffServices';
import type { Stylist } from '@modules/staff/domain/models/Stylist';

export interface ScheduleForm {
  day: ScheduleDay;
  startsAt: string; // "HH:mm"
  endsAt: string;   // "HH:mm"
}

export interface ScheduleFormErrors {
  day?: string;
  startsAt?: string;
  endsAt?: string;
}

// Orden canónico de la semana, tal como lo espera el backend.
export const WEEK_DAYS: { value: ScheduleDay; label: string }[] = [
  { value: 'lunes', label: 'Lunes' },
  { value: 'martes', label: 'Martes' },
  { value: 'miercoles', label: 'Miércoles' },
  { value: 'jueves', label: 'Jueves' },
  { value: 'viernes', label: 'Viernes' },
  { value: 'sabado', label: 'Sábado' },
  { value: 'domingo', label: 'Domingo' },
];

const emptyForm: ScheduleForm = {
  day: 'lunes',
  startsAt: '09:00',
  endsAt: '18:00',
};

export function useStaffSchedulesPresenter() {
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [schedules, setSchedules] = useState<StaffSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ScheduleForm>(emptyForm);
  const [errors, setErrors] = useState<ScheduleFormErrors>({});

  const loadStylists = useCallback(async (isCancelled?: () => boolean) => {
    try {
      const data = await staffService.getStylists();
      if (isCancelled?.()) return;
      setStylists(data);
      // Autoselecciona el primer estilista para que la rejilla nunca quede vacía.
      if (data.length > 0) {
        setSelectedStaffId((current) => current || data[0].id);
      }
    } catch {
      if (isCancelled?.()) return;
      setError('No se pudieron cargar los estilistas');
    }
  }, []);

  const loadSchedules = useCallback(
    async (staffId: string, isCancelled?: () => boolean) => {
      if (!staffId) {
        setSchedules([]);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const data = await staffScheduleService.getSchedulesByStaff(staffId);
        if (isCancelled?.()) return;
        setSchedules(data);
      } catch {
        if (isCancelled?.()) return;
        setError('No se pudieron cargar los horarios');
      } finally {
        if (!isCancelled?.()) setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    let cancelled = false;
    const isCancelled = () => cancelled;
    // Diferido para evitar setState sincrónico dentro del effect (patrón del proyecto).
    Promise.resolve()
      .then(() => loadStylists(isCancelled))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [loadStylists]);

  // Recarga los horarios cada vez que cambia el estilista seleccionado.
  useEffect(() => {
    let cancelled = false;
    const isCancelled = () => cancelled;
    Promise.resolve()
      .then(() => loadSchedules(selectedStaffId, isCancelled))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [selectedStaffId, loadSchedules]);

  const reload = useCallback(async () => {
    await loadSchedules(selectedStaffId);
  }, [loadSchedules, selectedStaffId]);

  // Horarios indexados por día para pintar la rejilla semanal de forma directa.
  const scheduleByDay = useMemo(() => {
    const map: Partial<Record<ScheduleDay, StaffSchedule>> = {};
    for (const schedule of schedules) {
      map[schedule.day] = schedule;
    }
    return map;
  }, [schedules]);

  // Días que aún no tienen horario configurado: son los que ofrece el formulario.
  const availableDays = useMemo(() => {
    const configured = new Set(schedules.map((s) => s.day));
    return WEEK_DAYS.filter((d) => !configured.has(d.value));
  }, [schedules]);

  const openCreate = () => {
    setForm({
      ...emptyForm,
      day: availableDays[0]?.value ?? 'lunes',
    });
    setErrors({});
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setErrors({});
  };

  const validate = (): boolean => {
    const next: ScheduleFormErrors = {};
    if (!form.day) next.day = 'Selecciona un día';
    if (!form.startsAt) next.startsAt = 'La hora de inicio es obligatoria';
    if (!form.endsAt) next.endsAt = 'La hora de fin es obligatoria';
    if (form.startsAt && form.endsAt && form.startsAt >= form.endsAt) {
      next.endsAt = 'La hora de fin debe ser posterior a la de inicio';
    }
    if (scheduleByDay[form.day]) {
      next.day = 'Este día ya tiene un horario configurado';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaffId) {
      setError('Selecciona un estilista primero');
      return;
    }
    if (!validate()) return;
    try {
      await staffScheduleService.createSchedule({
        staffId: selectedStaffId,
        day: form.day,
        startsAt: form.startsAt,
        endsAt: form.endsAt,
      });
      handleClose();
      await reload();
    } catch {
      setError('No se pudo crear el horario');
    }
  };

  const updateSchedule = async (
    schedule: StaffSchedule,
    startsAt: string,
    endsAt: string
  ) => {
    try {
      const updated = await staffScheduleService.updateSchedule(schedule.id, {
        startsAt,
        endsAt,
        isActive: schedule.isActive,
      });
      setSchedules((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    } catch {
      setError('No se pudo actualizar el horario');
    }
  };

  const toggleActive = async (schedule: StaffSchedule) => {
    try {
      const updated = await staffScheduleService.updateSchedule(schedule.id, {
        startsAt: toTimeInput(schedule.startsAt),
        endsAt: toTimeInput(schedule.endsAt),
        isActive: !schedule.isActive,
      });
      setSchedules((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    } catch {
      setError('No se pudo actualizar el horario');
    }
  };

  const deleteSchedule = async (id: string) => {
    try {
      await staffScheduleService.deleteSchedule(id);
      setSchedules((prev) => prev.filter((s) => s.id !== id));
    } catch {
      setError('No se pudo eliminar el horario');
    }
  };

  const activeCount = schedules.filter((s) => s.isActive).length;

  return {
    stylists,
    selectedStaffId,
    setSelectedStaffId,
    schedules,
    scheduleByDay,
    availableDays,
    activeCount,
    isLoading,
    error,
    clearError: () => setError(null),
    open,
    form,
    setForm,
    errors,
    openCreate,
    handleClose,
    handleSubmit,
    updateSchedule,
    toggleActive,
    deleteSchedule,
    reload,
  };
}