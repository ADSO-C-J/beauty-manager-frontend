import type { User } from './User';

export interface Auth {
  token: string;
  refreshToken?: string;
  expiresIn?: number;
  user?: User;
}
