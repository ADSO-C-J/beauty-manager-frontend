import type { SystemUser, UserRole } from '../models/SystemUser';

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: UserRole;
}

// El backend usa el mismo UserRequestDTO para crear y actualizar,
// por lo que exige 'password' en ambos casos.
export interface UpdateUserData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: UserRole;
}

export interface UserRepository {
  getUsers(): Promise<SystemUser[]>;
  getUserById(id: string): Promise<SystemUser | null>;
  createUser(data: CreateUserData): Promise<SystemUser>;
  updateUser(id: string, data: UpdateUserData): Promise<SystemUser>;
  deleteUser(id: string): Promise<void>;
}