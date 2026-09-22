import { useCallback, useEffect, useMemo, useState } from 'react';
import { reviewService } from '@modules/reviews/application/reviewServices';
import { appointmentService } from '@modules/appointments/application/appointmentServices';
import { clientService } from '@modules/clients/application/clientServices';
import { staffService } from '@modules/staff/application/staffServices';
import type { Appointment } from '@modules/appointments/domain/models/Appointment';
import type { Client } from '@modules/clients/domain/models/Client';
import type { Stylist } from '@modules/staff/domain/models/Stylist';
import type { Review, RatingStats } from '@modules/reviews/domain/models/Review';

export interface ReviewForm {
  appointmentId: string;
  clientId: string;
  staffId: string;
  rating: number;
  comment: string;
  isPublic: boolean;
}

export interface ReviewFormErrors {
  appointmentId?: string;
  clientId?: string;
  rating?: string;
}

const emptyForm: ReviewForm = {
  appointmentId: '',
  clientId: '',
  staffId: '',
  rating: 5,
  comment: '',
  isPublic: true,
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

// Máximo de clientes que se cargan para el selector (sin búsqueda server-side).
const CLIENT_FETCH_LIMIT = 200;

export function useReviewsPresenter() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ratingStats, setRatingStats] = useState<RatingStats[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ReviewForm>(emptyForm);
  const [errors, setErrors] = useState<ReviewFormErrors>({});
  const [detailReview, setDetailReview] = useState<Review | null>(null);

  const loadData = useCallback(async (isCancelled?: () => boolean) => {
    setIsLoading(true);
    setError(null);
    try {
      const [allReviews, stats] = await Promise.all([
        reviewService.getReviews(),
        reviewService.getRatingStats(),
      ]);
      if (isCancelled?.()) return;
      setReviews(allReviews);
      setRatingStats(stats);
    } catch {
      if (isCancelled?.()) return;
      setError('No se pudieron cargar las reseñas');
    } finally {
      if (!isCancelled?.()) setIsLoading(false);
    }
  }, []);

  // Carga catálogos para los selectores: citas, clientes y estilistas.
  const loadCatalogs = useCallback(async (isCancelled?: () => boolean) => {
    const { dateFrom, dateTo } = appointmentRange();
    const [aptRes, clientRes, stylistRes] = await Promise.allSettled([
      appointmentService.getAppointments(dateFrom, dateTo),
      clientService.searchClients(''),
      staffService.getStylists(),
    ]);
    if (isCancelled?.()) return;
    if (aptRes.status === 'fulfilled') setAppointments(aptRes.value);
    if (clientRes.status === 'fulfilled') {
      setClients(clientRes.value.slice(0, CLIENT_FETCH_LIMIT));
    }
    if (stylistRes.status === 'fulfilled') setStylists(stylistRes.value);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const isCancelled = () => cancelled;
    // Diferido para evitar setState sincrónico dentro del effect (patrón del proyecto).
    Promise.resolve()
      .then(() => loadData(isCancelled))
      .then(() => loadCatalogs(isCancelled))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [loadData, loadCatalogs]);

  // Recarga todo (reseñas + catálogos) sin efectos de desmontaje.
  const reload = useCallback(async () => {
    await loadData();
    await loadCatalogs();
  }, [loadData, loadCatalogs]);

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

  const clientOptions = useMemo(
    () =>
      clients.map((c) => ({
        id: c.id,
        label: c.email ? `${c.name} (${c.email})` : c.name,
      })),
    [clients]
  );

  const stylistOptions = useMemo(
    () => stylists.map((s) => ({ id: s.id, label: s.name })),
    [stylists]
  );

  const handleClose = () => {
    setOpen(false);
    setForm(emptyForm);
    setErrors({});
  };

  const validate = (): boolean => {
    const next: ReviewFormErrors = {};
    if (!form.appointmentId.trim()) next.appointmentId = 'El ID de la cita es obligatorio';
    if (!form.clientId.trim()) next.clientId = 'El ID del cliente es obligatorio';
    if (form.rating < 1 || form.rating > 5) next.rating = 'La calificación debe ser entre 1 y 5';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await reviewService.createReview({
        appointmentId: form.appointmentId.trim(),
        clientId: form.clientId.trim(),
        staffId: form.staffId.trim() || undefined,
        rating: form.rating,
        comment: form.comment.trim() || undefined,
        isPublic: form.isPublic,
      });
      handleClose();
      await reload();
    } catch {
      setError('No se pudo crear la reseña');
    }
  };

  const toggleVisibility = async (review: Review) => {
    try {
      const updated = await reviewService.updateReview(review.id, {
        isPublic: !review.isPublic,
      });
      setReviews((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      setDetailReview((prev) => (prev && prev.id === updated.id ? updated : prev));
    } catch {
      setError('No se pudo actualizar la reseña');
    }
  };

  const destructiveDelete = async (id: string) => {
    try {
      await reviewService.deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
      setDetailReview(null);
      await reload();
    } catch {
      setError('No se pudo eliminar la reseña');
    }
  };

  const filteredReviews = reviews.filter((r) => {
    const matchesRating = filterRating === 'all' || r.rating === filterRating;
    const term = searchTerm.trim().toLowerCase();
    const matchesTerm =
      term === '' ||
      (r.comment ?? '').toLowerCase().includes(term) ||
      r.appointmentId.toLowerCase().includes(term) ||
      r.clientId.toLowerCase().includes(term);
    return matchesRating && matchesTerm;
  });

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return {
    reviews,
    ratingStats,
    appointmentOptions,
    clientOptions,
    stylistOptions,
    isLoading,
    error,
    clearError: () => setError(null),
    searchTerm,
    setSearchTerm,
    filterRating,
    setFilterRating,
    open,
    setOpen,
    form,
    setForm,
    errors,
    detailReview,
    setDetailReview,
    handleClose,
    handleSubmit,
    toggleVisibility,
    deleteReview: destructiveDelete,
    reload,
    filteredReviews,
    averageRating,
  };
}