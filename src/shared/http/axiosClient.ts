import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@modules/auth/application/state/authStore';

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'https://beautymanagerapi-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/** Endpoints públicos: no deben disparar el manejo de 401 ni el refresh. */
const PUBLIC_PATHS = ['/auth/login', '/auth/register', '/auth/refresh'];

const isPublicPath = (url?: string): boolean =>
  !!url && PUBLIC_PATHS.some((path) => url.includes(path));

/**
 * Interceptor de petición: adjunta el token JWT vigente.
 * Se toma del store (fuente única) con fallback a localStorage, para que
 * cualquier cambio de sesión quede reflejado inmediatamente en las peticiones.
 */
axiosClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token ?? localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** Marca en la config que la petición ya se reintentó tras un refresh. */
type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

// Refresh en curso: mientras se renueva, las peticiones que reciban 401 se
// encolan aquí y se reintentan cuando el nuevo token esté listo (evita que
// varias peticiones concurrentes disparen varios refresh a la vez).
let refreshPromise: Promise<string> | null = null;

async function renewToken(): Promise<string> {
  const refreshToken =
    useAuthStore.getState().refreshToken ?? localStorage.getItem('refresh-token');
  if (!refreshToken) throw new Error('No hay refresh token disponible');

  // Import dinámico: evita un ciclo de importación en tiempo de carga
  // (axiosClient -> refreshUseCase -> authRepository -> AuthApiRepository -> axiosClient).
  const { refreshUseCase } = await import('@modules/auth/application/refreshUseCase');
  const { token, refreshToken: newRefresh } = await refreshUseCase.execute(refreshToken);
  useAuthStore.getState().setTokens(token, newRefresh);
  return token;
}

/**
 * Interceptor de respuesta:
 *  - Ante un 401, intenta renovar el JWT con el refresh token y reintenta la
 *    petición original una sola vez.
 *  - Si el refresh no existe o falla, limpia la sesión y envía al login.
 *  - No se dispara en endpoints públicos (login/register/refresh), para no
 *    interferir con un login fallido ni provocar recursión.
 */
axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error?.response?.status;
    const config = error?.config as RetriableConfig | undefined;
    const requestUrl = config?.url;

    const hadSession =
      useAuthStore.getState().isAuthenticated || !!localStorage.getItem('token');

    if (status === 401 && !isPublicPath(requestUrl) && config && !config._retried && hadSession) {
      // Reintenta una sola vez por petición (evita bucles infinitos).
      config._retried = true;
      try {
        // Si ya hay un refresh en curso, todas las peticiones concurrentes esperan
        // a ese mismo para no disparar varios /auth/refresh a la vez.
        if (!refreshPromise) {
          refreshPromise = renewToken().finally(() => {
            refreshPromise = null;
          });
        }
        const newToken = await refreshPromise;

        config.headers.Authorization = `Bearer ${newToken}`;
        return axiosClient.request(config);
      } catch {
        // No se pudo renovar: cerramos la sesión y mandamos al login.
        useAuthStore.getState().forceLogout();
        const { pathname } = window.location;
        if (!pathname.startsWith('/login')) {
          window.location.assign('/login');
        }
      }
    }

    return Promise.reject(error);
  }
);
