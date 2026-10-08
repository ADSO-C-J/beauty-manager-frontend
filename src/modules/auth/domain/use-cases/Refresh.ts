import type { AuthRepository, RefreshedAuth } from '../ports/AuthRepository';

export class Refresh {
  private readonly authRepository: AuthRepository;
  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  async execute(refreshToken: string): Promise<RefreshedAuth> {
    return this.authRepository.refresh(refreshToken);
  }
}
