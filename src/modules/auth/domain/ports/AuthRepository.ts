import type { Auth } from '../models/Auth';
import type { User } from '../models/User';

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
}
