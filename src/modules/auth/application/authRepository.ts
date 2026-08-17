import { AuthApiRepository } from '../infrastructure/repository/AuthApiRepository';

/**
 * Instancia única del repositorio de autenticación (axios/http).
 * Se comparte entre todos los casos de uso del módulo.
 */
export const authRepository = new AuthApiRepository();