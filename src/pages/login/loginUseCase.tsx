import { Login } from '@modules/auth/domain/use-cases/Login';
import { AuthApiRepository } from '@modules/auth/infrastructure/repository/AuthApiRepository';

const authRepository = new AuthApiRepository();
export const loginUseCase = new Login(authRepository);
