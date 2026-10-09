import type { Auth } from '../../domain/models/Auth';

export interface AuthApiUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role?: string;
  businessId?: string;
}

export interface AuthApiResponse {
  token: string;
  refreshToken?: string;
  expiresIn?: number;
  user?: AuthApiUser;
  /** Roles otorgados por el backend, p. ej. ["ROLE_administrador"]. */
  roles?: string[];
}

/**
 * El backend devuelve el rol tanto en `user.role` ("administrador") como en
 * `roles` ("ROLE_administrador"). Si el usuario no viene, se deriva de `roles`
 * para no perder los permisos.
 */
const resolveRole = (
  userRole?: string,
  roles?: string[]
): string | undefined => {
  if (userRole) return userRole;
  const fromRoles = roles?.find((role) => role.startsWith("ROLE_"));
  return fromRoles ? fromRoles.replace(/^ROLE_/, "") : undefined;
};

export const authMapper = (response: AuthApiResponse): Auth => ({
  token: response.token,
  refreshToken: response.refreshToken,
  expiresIn: response.expiresIn,
  user: response.user
    ? {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        phone: response.user.phone,
        role: resolveRole(response.user.role, response.roles),
        avatar: response.user.avatarUrl,
        businessId: response.user.businessId,
      }
    : undefined,
});
