import { GetProfile } from '../domain/use-cases/GetProfile';
import { authRepository } from './authRepository';

export const getProfileUseCase = new GetProfile(authRepository);
