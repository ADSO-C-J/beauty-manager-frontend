import type { User } from '../models/User';
import type { AuthRepository } from '../ports/AuthRepository';

export class Register {
  private readonly authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  async execute(
    name: string,
    email: string,
    password: string,
    phone: string,
    role: string
  ): Promise<User> {
    return this.authRepository.register(name, email, password, phone, role);
  }
}
