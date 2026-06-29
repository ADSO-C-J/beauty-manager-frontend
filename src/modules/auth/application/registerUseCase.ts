import { Register } from '@modules/auth/domain/use-cases/Register';
import { AuthApiRepository } from '@modules/auth/infrastructure/repository/AuthApiRepository';

const authRepository = new AuthApiRepository();
export const registerUseCase = new Register(authRepository);
