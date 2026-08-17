import { Register } from '../domain/use-cases/Register';
import { authRepository } from './authRepository';

export const registerUseCase = new Register(authRepository);
