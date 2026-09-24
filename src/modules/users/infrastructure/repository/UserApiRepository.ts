import { axiosClient } from '@shared/http/axiosClient';
import type { SystemUser } from '../../domain/models/SystemUser';
import type {
  UserRepository,
  CreateUserData,
  UpdateUserData,
} from '../../domain/ports/UserRepository';
import { toSystemUser, type ApiUser } from '../mappers/userMapper';

export class UserApiRepository implements UserRepository {
  async getUsers(): Promise<SystemUser[]> {
    const { data } = await axiosClient.get<ApiUser[]>('/users');
    return (data ?? []).map(toSystemUser);
  }

  async getUserById(id: string): Promise<SystemUser | null> {
    try {
      const { data } = await axiosClient.get<ApiUser>(`/users/${id}`);
      return toSystemUser(data);
    } catch {
      return null;
    }
  }

  async createUser(data: CreateUserData): Promise<SystemUser> {
    const { data: response } = await axiosClient.post<ApiUser>('/users', {
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      role: data.role,
    });
    return toSystemUser(response);
  }

  async updateUser(id: string, data: UpdateUserData): Promise<SystemUser> {
    const { data: response } = await axiosClient.put<ApiUser>(`/users/${id}`, {
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      role: data.role,
    });
    return toSystemUser(response);
  }

  async deleteUser(id: string): Promise<void> {
    await axiosClient.delete(`/users/${id}`);
  }
}