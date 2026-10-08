import type { Auth } from '../models/Auth';
import type { User } from '../models/User';

/** Resultado de renovar la sesión con el refresh token. */
export interface RefreshedAuth {
  token: string;
  refreshToken?: string;
}

export interface AuthRepository {
  login(email: string, password: string): Promise<Auth>;
  register(
    name: string,
    email: string,
    password: string,
    phone?: string
  ): Promise<User>;
  /** Revoca el token en el servidor para que deje de ser válido. */
  logout(): Promise<void>;
  /** Obtiene los datos del usuario autenticado desde el servidor. */
  getProfile(): Promise<User>;
  /** Renueva el JWT usando el refresh token; el backend rota el refresh token. */
  refresh(refreshToken: string): Promise<RefreshedAuth>;
}
