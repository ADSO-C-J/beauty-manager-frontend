import { create } from "zustand";
import { ROUTES } from "@app/router/routes";
import { loginUseCase } from "@modules/auth/application/loginUseCase";
import { registerUseCase } from "@modules/auth/application/registerUseCase";

export type UserRole = "administrador" | "estilista" | "recepcionista" | "cliente";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    phone?: string
  ) => Promise<void>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  clearError: () => void;
}

const TOKEN_KEY = "token";
const STORAGE_KEY = "auth-storage";

const getStoredUser = (): User | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.state?.user || null;
    }
  } catch (error) {
    console.error("Error loading user from storage:", error);
  }
  return null;
};

const getStoredToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error("Error loading token from storage:", error);
    return null;
  }
};

const storedUser = getStoredUser();
const storedToken = getStoredToken();

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null) {
    const anyError = error as { response?: { data?: { message?: string } } };
    if (anyError.response?.data?.message) {
      return anyError.response.data.message;
    }
  }
  if (error instanceof Error) return error.message;
  return "Ocurrió un error inesperado";
};

const persistSession = (token: string, user: User) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ state: { user } }));
  } catch (error) {
    console.error("Error saving session:", error);
  }
};

const clearSession = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing session:", error);
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: storedUser,
  token: storedToken,
  isLoading: false,
  isAuthenticated: storedUser !== null && storedToken !== null,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const auth = await loginUseCase.execute(email, password);

      const user: User = {
        id: auth.user?.id ?? "",
        name: auth.user?.name ?? email,
        email: auth.user?.email ?? email,
        phone: auth.user?.phone,
        role: (auth.user?.role as UserRole) ?? "cliente",
        avatar: auth.user?.avatar,
      };

      persistSession(auth.token, user);
      set({ user, token: auth.token, isLoading: false, isAuthenticated: true, error: null });
    } catch (error) {
      const message = getErrorMessage(error);
      set({ isLoading: false, isAuthenticated: false, error: message });
      throw new Error(message);
    }
  },

  register: async (name, email, password, phone) => {
    set({ isLoading: true, error: null });
    try {
      // El backend fuerza rol 'cliente'; aquí no se envía rol.
      await registerUseCase.execute(name, email, password, phone);

      // Auto-login tras el registro para obtener el token JWT.
      const auth = await loginUseCase.execute(email, password);

      const user: User = {
        id: auth.user?.id ?? "",
        name: auth.user?.name ?? name,
        email: auth.user?.email ?? email,
        phone: auth.user?.phone,
        role: (auth.user?.role as UserRole) ?? "cliente",
        avatar: auth.user?.avatar,
      };

      persistSession(auth.token, user);
      set({ user, token: auth.token, isLoading: false, isAuthenticated: true, error: null });
    } catch (error) {
      const message = getErrorMessage(error);
      set({ isLoading: false, isAuthenticated: false, error: message });
      throw new Error(message);
    }
  },

  logout: () => {
    clearSession();
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  clearError: () => {
    set({ error: null });
  },
}));

export const rolePermissions: Record<UserRole, string[]> = {
  administrador: [
    ROUTES.DASHBOARD,
    ROUTES.DASHBOARD_APPOINTMENTS,
    ROUTES.DASHBOARD_CLIENTS,
    ROUTES.DASHBOARD_SERVICES,
    ROUTES.DASHBOARD_FACIAL_ANALYSIS,
    ROUTES.DASHBOARD_REPORTS,
    ROUTES.DASHBOARD_SETTINGS,
    ROUTES.DASHBOARD_SCHEDULER,
  ],
  estilista: [
    ROUTES.DASHBOARD,
    ROUTES.DASHBOARD_APPOINTMENTS,
    ROUTES.DASHBOARD_CLIENTS,
    ROUTES.DASHBOARD_SERVICES,
    ROUTES.DASHBOARD_FACIAL_ANALYSIS,
    ROUTES.DASHBOARD_SCHEDULER,
  ],
  recepcionista: [
    ROUTES.DASHBOARD,
    ROUTES.DASHBOARD_APPOINTMENTS,
    ROUTES.DASHBOARD_CLIENTS,
    ROUTES.DASHBOARD_SERVICES,
    ROUTES.DASHBOARD_SCHEDULER,
  ],
  cliente: [
    ROUTES.DASHBOARD,
    ROUTES.DASHBOARD_APPOINTMENTS,
    ROUTES.DASHBOARD_FACIAL_ANALYSIS,
  ],
};

export function hasPermission(role: UserRole | undefined, path: string): boolean {
  if (!role) return false;
  return rolePermissions[role].some((allowedPath) => {
    if (path === allowedPath) return true;
    // Sub-path match only for specific routes (not the base /dashboard)
    if (allowedPath === ROUTES.DASHBOARD) return false;
    return path.startsWith(allowedPath + "/");
  });
}
