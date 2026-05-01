import { useState } from 'react';
import { Register } from '../../domain/use-cases/Register';
import { AuthApiRepository } from '../../infrastructure/repository/AuthApiRepository';

const authRepository = new AuthApiRepository();
const registerUseCase = new Register(authRepository);

export const useRegisterPresenter = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await registerUseCase.execute(name, email, password);
      setSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al registrar usuario';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleRegister, isLoading, error, success };
};
