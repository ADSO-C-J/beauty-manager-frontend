import { Refresh } from '../domain/use-cases/Refresh';
import { authRepository } from './authRepository';

export const refreshUseCase = new Refresh(authRepository);
