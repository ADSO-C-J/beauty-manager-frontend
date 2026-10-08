import type { User } from '../models/User';
import type { AuthRepository } from '../ports/AuthRepository';

export class GetProfile {
  private readonly authRepository: AuthRepository;
  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  async execute(): Promise<User> {
    return this.authRepository.getProfile();
  }
}
