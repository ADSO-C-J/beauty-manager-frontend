import type { User } from "../../domain/models/User";

export interface RegisterApiResponse {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export const registerMapper = (response: RegisterApiResponse): User => ({
  id: response.id,
  name: response.name,
  email: response.email,
  role: response.role,
});
