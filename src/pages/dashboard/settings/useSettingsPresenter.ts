import { useCallback, useEffect, useMemo, useState } from 'react';
import { businessService } from '@modules/business/application/businessServices';
import type {
  Business,
  BusinessHours,
  NotificationPreferences,
  ScheduleDay,
} from '@modules/business/domain/models/Business';
import type { UpdateBusinessData } from '@modules/business/domain/ports/BusinessRepository';
import { toTimeInput } from '@modules/business/infrastructure/mappers/businessMapper';
import { useAuthStore } from '@modules/auth/application/state/authStore';

// Orden canónico de la semana; el backend espera estos valores exactos.
export const WEEK_DAYS: { value: ScheduleDay; label: string }[] = [
  { value: 'lunes', label: 'Lunes' },
  { value: 'martes', label: 'Martes' },
  { value: 'miercoles', label: 'Miércoles' },
  { value: 'jueves', label: 'Jueves' },
  { value: 'viernes', label: 'Viernes' },
  { value: 'sabado', label: 'Sábado' },
  { value: 'domingo', label: 'Domingo' },
];

export interface BusinessForm {
  name: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  currency: string;
  timezone: string;
}

export interface BusinessFormErrors {
  name?: string;
  country?: string;
  currency?: string;
  email?: string;
}

const emptyBusinessForm: BusinessForm = {
  name: '',
  address: '',
  city: '',
  country: '',
  phone: '',
  email: '',
  website: '',
  currency: 'USD',
  timezone: '',
};

export type NotificationKey = keyof Pick<
  NotificationPreferences,
  | 'appointmentReminders'
  | 'newClients'
  | 'cancellations'
  | 'monthlyReports'
  | 'systemUpdates'
>;

export function useSettingsPresenter() {
  const user = useAuthStore((state) => state.user);

  const [business, setBusiness] = useState<Business | null>(null);
  const [form, setForm] = useState<BusinessForm>(emptyBusinessForm);
  const [errors, setErrors] = useState<BusinessFormErrors>({});

  const [hours, setHours] = useState<BusinessHours[]>([]);
  const [notifications, setNotifications] = useState<NotificationPreferences | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingBusiness, setIsSavingBusiness] = useState(false);
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadBusiness = useCallback(async (isCancelled?: () => boolean) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await businessService.getBusiness();
      if (isCancelled?.()) return;
      setBusiness(data);
      setForm({
        name: data.name ?? '',
        address: data.address ?? '',
        city: data.city ?? '',
        country: data.country ?? '',
        phone: data.phone ?? '',
        email: data.email ?? '',
        website: data.website ?? '',
        currency: data.currency ?? 'USD',
        timezone: data.timezone ?? '',
      });
    } catch {
      if (isCancelled?.()) return;
      setError('No se pudo cargar la configuración del negocio');
    } finally {
      if (!isCancelled?.()) setIsLoading(false);
    }
  }, []);

  const loadHours = useCallback(
    async (businessId: string, isCancelled?: () => boolean) => {
      try {
        const data = await businessService.getBusinessHours(businessId);
        if (isCancelled?.()) return;
        setHours(data);
      } catch {
        if (isCancelled?.()) return;
        // Los horarios son opcionales en la UI; no bloquea el resto de la página.
      }
    },
    []
  );

  const loadNotifications = useCallback(
    async (userId: string, isCancelled?: () => boolean) => {
      try {
        const data = await businessService.getNotificationPreferences(userId);
        if (isCancelled?.()) return;
        setNotifications(data);
      } catch {
        if (isCancelled?.()) return;
        // Preferencias opcionales; el backend crea unas por defecto.
      }
    },
    []
  );

  useEffect(() => {
    let cancelled = false;
    const isCancelled = () => cancelled;
    // Diferido para evitar setState sincrónico dentro del effect (patrón del proyecto).
    Promise.resolve()
      .then(() => loadBusiness(isCancelled))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [loadBusiness]);

  // Los horarios y las notificaciones dependen de datos cargados aparte.
  useEffect(() => {
    if (!business?.id) return;
    let cancelled = false;
    const isCancelled = () => cancelled;
    Promise.resolve()
      .then(() => loadHours(business.id, isCancelled))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [business?.id, loadHours]);

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    const isCancelled = () => cancelled;
    Promise.resolve()
      .then(() => loadNotifications(user.id, isCancelled))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [user?.id, loadNotifications]);

  // Días indexados para pintar la rejilla de horarios del negocio.
  const hoursByDay = useMemo(() => {
    const map: Partial<Record<ScheduleDay, BusinessHours>> = {};
    for (const h of hours) map[h.day] = h;
    return map;
  }, [hours]);

  const validateBusiness = (): boolean => {
    const next: BusinessFormErrors = {};
    if (!form.name.trim()) next.name = 'El nombre del negocio es obligatorio';
    if (!form.country.trim()) next.country = 'El país es obligatorio';
    if (!form.currency.trim()) next.currency = 'La moneda es obligatoria';
    if (form.email && !/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) {
      next.email = 'Formato de email inválido';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const saveBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateBusiness()) return;
    setIsSavingBusiness(true);
    setError(null);
    setSuccess(null);
    try {
      const payload: UpdateBusinessData = {
        name: form.name.trim(),
        address: form.address.trim() || undefined,
        city: form.city.trim() || undefined,
        country: form.country.trim(),
        phone: form.phone.trim() || undefined,
        email: form.email.trim() || undefined,
        website: form.website.trim() || undefined,
        currency: form.currency.trim(),
        timezone: form.timezone.trim() || undefined,
      };
      const updated = await businessService.updateBusiness(payload);
      setBusiness(updated);
      setSuccess('Datos del negocio guardados');
    } catch {
      setError('No se pudieron guardar los datos del negocio');
    } finally {
      setIsSavingBusiness(false);
    }
  };

  const upsertHours = async (
    day: ScheduleDay,
    opensAt: string,
    closesAt: string,
    isClosed: boolean
  ) => {
    if (!business?.id) return;
    try {
      const updated = await businessService.upsertBusinessHours(business.id, {
        day,
        opensAt,
        closesAt,
        isClosed,
      });
      setHours((prev) => {
        const exists = prev.some((h) => h.id === updated.id || h.day === updated.day);
        if (!exists) return [...prev, updated];
        return prev.map((h) => (h.day === updated.day ? updated : h));
      });
    } catch {
      setError('No se pudo guardar el horario');
    }
  };

  const toggleDayClosed = async (day: ScheduleDay, isClosed: boolean) => {
    const existing = hoursByDay[day];
    await upsertHours(
      day,
      existing ? toTimeInput(existing.opensAt ?? '') : '09:00',
      existing ? toTimeInput(existing.closesAt ?? '') : '18:00',
      isClosed
    );
  };

  const toggleNotification = async (key: NotificationKey, value: boolean) => {
    if (!user?.id || !notifications) return;
    const next = { ...notifications, [key]: value };
    setNotifications(next); // optimista
    setIsSavingNotifications(true);
    setError(null);
    try {
      const saved = await businessService.updateNotificationPreferences(user.id, next);
      setNotifications(saved);
      setSuccess('Preferencias de notificaciones guardadas');
    } catch {
      setNotifications(notifications); // revierte
      setError('No se pudieron guardar las preferencias');
    } finally {
      setIsSavingNotifications(false);
    }
  };

  // El perfil se gestiona localmente (no hay endpoint propio en este alcance);
  // se muestra a partir del usuario autenticado.
  const saveProfile = async () => {
    setIsSavingProfile(true);
    setSuccess('Los datos de perfil se obtienen del usuario autenticado');
    setTimeout(() => setIsSavingProfile(false), 300);
  };

  return {
    user,
    business,
    form,
    setForm,
    errors,
    hours,
    hoursByDay,
    notifications,
    isLoading,
    isSavingProfile,
    isSavingBusiness,
    isSavingNotifications,
    error,
    success,
    clearMessages: () => {
      setError(null);
      setSuccess(null);
    },
    saveProfile,
    saveBusiness,
    upsertHours,
    toggleDayClosed,
    toggleNotification,
  };
}