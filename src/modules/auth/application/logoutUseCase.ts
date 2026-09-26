import { Logout } from '../domain/use-cases/Logout';
import { authRepository } from './authRepository';

export const logoutUseCase = new Logout(authRepository);