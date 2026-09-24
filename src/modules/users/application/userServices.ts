import { UserApiRepository } from '../infrastructure/repository/UserApiRepository';
import type {
  UserRepository,
  CreateUserData,
  UpdateUserData,
} from '../domain/ports/UserRepository';

const repository: UserRepository = new UserApiRepository();

export const userService = {
  getUsers: () => repository.getUsers(),
  getUserById: (id: string) => repository.getUserById(id),
  createUser: (data: CreateUserData) => repository.createUser(data),
  updateUser: (id: string, data: UpdateUserData) => repository.updateUser(id, data),
  deleteUser: (id: string) => repository.deleteUser(id),
};