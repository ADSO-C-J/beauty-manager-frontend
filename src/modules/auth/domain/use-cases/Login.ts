import type { Auth } from '../models/Auth';
import type { AuthRepository } from '../ports/AuthRepository';

export class Login {
  private readonly authRepository: AuthRepository;
  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  async execute(email: string, password: string): Promise<Auth> {
    return this.authRepository.login(email, password);
  }
}
