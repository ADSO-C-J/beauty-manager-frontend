import type { Notification } from '../../domain/models/Notification';

// Estructura que devuelve el backend (NotificationResponseDTO)
export interface ApiNotification {
  id: string;
  type: string;
  title: string;
  body?: string;
  isRead: boolean;
  readAt?: string;
  metadata?: Record<string, unknown>;
  createdAt?: string;
}

export function toNotification(api: ApiNotification): Notification {
  return {
    id: api.id,
    type: api.type,
    title: api.title,
    body: api.body,
    isRead: api.isRead ?? false,
    readAt: api.readAt,
    metadata: api.metadata,
    createdAt: api.createdAt,
  };
}

// Etiquetas legibles por tipo de notificación.
export const typeLabels: Record<string, string> = {
  cita_creada: 'Cita',
  cita_cancelada: 'Cancelación',
  cita_confirmada: 'Cita',
  recordatorio: 'Recordatorio',
  nuevo_cliente: 'Cliente',
  pago: 'Pago',
  sistema: 'Sistema',
};

export function describeType(type: string): string {
  return typeLabels[type] ?? 'Aviso';
}