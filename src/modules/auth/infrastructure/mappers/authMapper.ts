import type { Auth } from '../../domain/models/Auth';

export interface AuthApiUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role?: string;
}

export interface AuthApiResponse {
  token: string;
  refreshToken?: string;
  expiresIn?: number;
  user?: AuthApiUser;
}

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
        role: response.user.role,
        avatar: response.user.avatarUrl,
      }
    : undefined,
});
