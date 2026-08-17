import { Login } from '../domain/use-cases/Login';
import { authRepository } from './authRepository';

export const loginUseCase = new Login(authRepository);