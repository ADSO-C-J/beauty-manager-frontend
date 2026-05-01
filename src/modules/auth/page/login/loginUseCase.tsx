import { Login } from '../../domain/use-cases/Login';
import { AuthApiRepository } from '../../infrastructure/repository/AuthApiRepository';

const authRepository = new AuthApiRepository();
export const loginUseCase = new Login(authRepository);
