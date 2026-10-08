import type { Auth } from '../../domain/models/Auth';
import type { User } from '../../domain/models/User';
import type { AuthRepository, RefreshedAuth } from '../../domain/ports/AuthRepository';
import { axiosClient } from '@shared/http/axiosClient';
import type { LoginDTO } from '../dtos/LoginDTO';
import type { RegisterDTO } from '../dtos/RegisterDTO';
import { authMapper, type AuthApiResponse, type AuthApiUser } from '../mappers/authMapper';
import { registerMapper, type RegisterApiResponse } from '../mappers/registerMapper';

export class AuthApiRepository implements AuthRepository {
  async login(email: string, password: string): Promise<Auth> {
    const dto: LoginDTO = { email, password };
    const response = await axiosClient.post<AuthApiResponse>('/auth/login', dto);
    return authMapper(response.data);
  }

  async register(
    name: string,
    email: string,
    password: string,
    phone?: string
  ): Promise<User> {
    // El rol lo define el backend (registro público siempre crea 'cliente').
    const dto: RegisterDTO = { name, email, password, phone };
    const response = await axiosClient.post<RegisterApiResponse>('/auth/register', dto);
    return registerMapper(response.data);
  }

  async logout(): Promise<void> {
    // El token va en el header Authorization (lo añade el interceptor del axiosClient).
    // Si falla (token ya expirado, sin red), el store limpia igualmente la sesión local.
    await axiosClient.post('/auth/logout');
  }

  async getProfile(): Promise<User> {
    const response = await axiosClient.get<AuthApiUser>('/auth/profile');
    return {
      id: response.data.id,
      name: response.data.name,
      email: response.data.email,
      phone: response.data.phone,
      role: response.data.role,
      avatar: response.data.avatarUrl,
      businessId: response.data.businessId,
    };
  }

  async refresh(refreshToken: string): Promise<RefreshedAuth> {
    const response = await axiosClient.post<AuthApiResponse>('/auth/refresh', {
      refreshToken,
    });
    return {
      token: response.data.token,
      refreshToken: response.data.refreshToken,
    };
  }
}
