import type { AuthRepository } from '../ports/AuthRepository';

/**
 * Cierra la sesión en el servidor (revoca el token JWT).
 * Si la llamada falla, el llamador debe limpiar igualmente la sesión local.
 */
export class Logout {
  private readonly authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  async execute(): Promise<void> {
    return this.authRepository.logout();
  }
}