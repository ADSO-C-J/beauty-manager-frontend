// Roles del sistema (enum UserRole del backend, en minúsculas).
export type UserRole = 'administrador' | 'estilista' | 'recepcionista' | 'cliente';

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}