import type { Auth } from '../../domain/models/Auth';
import type { User } from '../../domain/models/User';
import type { AuthRepository } from '../../domain/ports/AuthRepository';
import { axiosClient } from '@shared/http/axiosClient';
import type { LoginDTO } from '../dtos/LoginDTO';
import type { RegisterDTO } from '../dtos/RegisterDTO';
import { authMapper, type AuthApiResponse } from '../mappers/authMapper';
import { registerMapper, type RegisterApiResponse } from '../mappers/registerMapper';

export class AuthApiRepository implements AuthRepository {
  async login(email: string, password: string): Promise<Auth> {
    const dto: LoginDTO = { email, password };
    const response = await axiosClient.post<AuthApiResponse>('/auth/login', dto);
    return authMapper(response.data);
  }

  async register(name: string, email: string, password: string): Promise<User> {
    const dto: RegisterDTO = { name, email, password };
    const response = await axiosClient.post<RegisterApiResponse>('/auth/register', dto);
    return registerMapper(response.data);
  }
}
