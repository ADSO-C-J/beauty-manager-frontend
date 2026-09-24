import type { SystemUser, UserRole } from '../../domain/models/SystemUser';

// Estructura que devuelve el backend (UserResponseDTO)
export interface ApiUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export function toSystemUser(api: ApiUser): SystemUser {
  return {
    id: api.id,
    name: api.name,
    email: api.email,
    phone: api.phone,
    avatarUrl: api.avatarUrl,
    role: api.role as UserRole,
    isActive: api.isActive ?? true,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
  };
}

// Etiquetas legibles para la UI.
export const roleLabels: Record<UserRole, string> = {
  administrador: 'Administrador',
  estilista: 'Estilista',
  recepcionista: 'Recepcionista',
  cliente: 'Cliente',
};

export const ROLE_OPTIONS: UserRole[] = [
  'administrador',
  'estilista',
  'recepcionista',
  'cliente',
];