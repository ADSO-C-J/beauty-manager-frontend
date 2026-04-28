export interface Auth {
  token: string;
  refreshToken?: string;
  expiresIn?: number;
}
