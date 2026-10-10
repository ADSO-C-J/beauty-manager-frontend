import type { UserRole } from '@modules/auth/application/state/authStore';
import { resolveClientIdByEmail } from '@modules/facial-analysis/application/facialAnalysisServices';
import { staffService } from '@modules/staff/application/staffServices';
import type { Appointment } from '../domain/models/Appointment';

/**
 * Usuario mínimo que necesita el alcance de citas. Se declara localmente (en vez
 * de importar el `User` del store) para no acoplar este módulo a la autenticación.
 */
export interface AppointmentScopeUser {
  id: string;
  email: string;
  role: UserRole;
}

/**
 * `GET /api/appointments` devuelve todas las citas del negocio (solo filtra por
 * business), así que el alcance de cada rol se aplica aquí:
 *
 *  - cliente: solo sus citas. Si no se puede resolver su id de cliente no se
 *    muestra ninguna: jamás se deben exponer citas de terceros.
 *  - estilista: solo las suyas. Ojo: las citas guardan el `staff.id` (tabla
 *    staff), no el `user.id`, así que hay que mapear con `stylist.staffId`.
 *  - administrador y recepcionista: todas las del negocio.
 *
 * Nunca lanza: si falla la resolución de identidad se devuelve una lista vacía
 * para los roles restringidos (preferible a filtrar de más).
 */
export async function scopeAppointmentsToUser(
  appointments: Appointment[],
  user: AppointmentScopeUser | null,
): Promise<Appointment[]> {
  if (!user) return [];
  if (user.role !== 'cliente' && user.role !== 'estilista') return appointments;

  try {
    if (user.role === 'cliente') {
      const clientId = await resolveClientIdByEmail(user.email);
      if (!clientId) return [];
      return appointments.filter((apt) => apt.clientId === clientId);
    }

    const stylists = await staffService.getStylists();
    const staffId = stylists.find((stylist) => stylist.id === user.id)?.staffId;
    if (!staffId) return [];
    return appointments.filter((apt) => apt.stylistId === staffId);
  } catch {
    return [];
  }
}
