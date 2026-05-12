import type { Auth } from '../../domain/models/Auth';

export interface AuthApiResponse {
  token: string;
  refresh_token?: string;
  expires_in?: number;
}

export const authMapper = (response: AuthApiResponse): Auth => ({
  token: response.token,
  refreshToken: response.refresh_token,
  expiresIn: response.expires_in,
});
