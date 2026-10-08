import { create } from "zustand";
import { ROUTES } from "@app/router/routes";
import { loginUseCase } from "@modules/auth/application/loginUseCase";
import { logoutUseCase } from "@modules/auth/application/logoutUseCase";
import { registerUseCase } from "@modules/auth/application/registerUseCase";
import { getProfileUseCase } from "@modules/auth/application/getProfileUseCase";
import { userService } from "@modules/users/application/userServices";

export type UserRole = "administrador" | "estilista" | "recepcionista" | "cliente";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  businessId?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
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
  logout: () => void | Promise<void>;
  /** Limpia la sesión local sin llamar al backend (p. ej. ante un 401). */
  forceLogout: () => void;
  /** Aplica un token renovado (tras /auth/refresh) y lo persiste. */
  setTokens: (token: string, refreshToken?: string) => void;
  /** Trae los datos actuales del usuario desde el backend y actualiza el store. */
  refreshProfile: () => Promise<User>;
  /** Actualiza el perfil del usuario en el backend y sincroniza el store. */
  updateProfile: (data: { name: string; phone?: string; password?: string }) => Promise<User>;
  setLoading: (loading: boolean) => void;
  clearError: () => void;
}

const TOKEN_KEY = "token";
const REFRESH_KEY = "refresh-token";
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

const getStoredRefreshToken = (): string | null => {
  try {
    return localStorage.getItem(REFRESH_KEY);
  } catch (error) {
    console.error("Error loading refresh token from storage:", error);
    return null;
  }
};

const storedUser = getStoredUser();
const storedToken = getStoredToken();
const storedRefreshToken = getStoredRefreshToken();

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

const persistSession = (token: string, user: User, refreshToken?: string) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ state: { user } }));
  } catch (error) {
    console.error("Error saving session:", error);
  }
};

const clearSession = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing session:", error);
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: storedUser,
  token: storedToken,
  refreshToken: storedRefreshToken,
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
        businessId: auth.user?.businessId,
      };

      persistSession(auth.token, user, auth.refreshToken);
      set({
        user,
        token: auth.token,
        refreshToken: auth.refreshToken ?? null,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });
    } catch (error) {
      const message = getErrorMessage(error);
      set({ isLoading: false, isAuthenticated: false, error: message });
      throw new Error(message, { cause: error });
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
        businessId: auth.user?.businessId,
      };

      persistSession(auth.token, user, auth.refreshToken);
      set({
        user,
        token: auth.token,
        refreshToken: auth.refreshToken ?? null,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });
    } catch (error) {
      const message = getErrorMessage(error);
      set({ isLoading: false, isAuthenticated: false, error: message });
      throw new Error(message, { cause: error });
    }
  },

  logout: async () => {
    // 1. Revocar el token en el servidor para que deje de ser válido.
    try {
      await logoutUseCase.execute();
    } catch {
      // Si falla (sin red, token ya expirado...), seguimos con la limpieza local.
    }
    // 2. Limpiar la sesión en el cliente pase lo que pase.
    clearSession();
    set({ user: null, token: null, refreshToken: null, isAuthenticated: false, error: null });
  },

  forceLogout: () => {
    // Limpieza local sin llamar al backend (usado ante un 401: el token ya no sirve).
    clearSession();
    set({ user: null, token: null, refreshToken: null, isAuthenticated: false, error: null });
  },

  setTokens: (token, refreshToken) => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
      if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
    } catch (error) {
      console.error("Error saving tokens:", error);
    }
    set((state) => ({
      token,
      refreshToken: refreshToken ?? state.refreshToken,
      isAuthenticated: true,
    }));
  },

  refreshProfile: async () => {
    const profile = await getProfileUseCase.execute();
    const user: User = {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      role: (profile.role as UserRole) ?? "cliente",
      avatar: profile.avatar,
      businessId: profile.businessId,
    };
    const token = getStoredToken() ?? "";
    persistSession(token, user, getStoredRefreshToken() ?? undefined);
    set({ user, isAuthenticated: true });
    return user;
  },

  updateProfile: async ({ name, phone, password }) => {
    const current = getStoredUser();
    if (!current) throw new Error("No hay sesión activa");
    // El backend exige el mismo UserRequestDTO para actualizar (incluye password).
    const updated = await userService.updateUser(current.id, {
      name,
      email: current.email,
      password: password ?? "",
      phone,
      role: current.role,
    });
    const user: User = {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      role: updated.role,
      avatar: updated.avatarUrl ?? current.avatar,
      businessId: current.businessId,
    };
    const token = getStoredToken() ?? "";
    persistSession(token, user, getStoredRefreshToken() ?? undefined);
    set({ user });
    return user;
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
    ROUTES.DASHBOARD_PAYMENTS,
    ROUTES.DASHBOARD_REVIEWS,
    ROUTES.DASHBOARD_REPORTS,
    ROUTES.DASHBOARD_SETTINGS,
    ROUTES.DASHBOARD_SCHEDULER,
    ROUTES.DASHBOARD_SCHEDULES,
    ROUTES.DASHBOARD_USERS,
    ROUTES.DASHBOARD_SESSIONS,
    ROUTES.DASHBOARD_NOTIFICATIONS,
    ROUTES.DASHBOARD_AUDIT_LOGS,
  ],
  estilista: [
    ROUTES.DASHBOARD,
    ROUTES.DASHBOARD_APPOINTMENTS,
    ROUTES.DASHBOARD_CLIENTS,
    ROUTES.DASHBOARD_SERVICES,
    ROUTES.DASHBOARD_FACIAL_ANALYSIS,
    ROUTES.DASHBOARD_REVIEWS,
    ROUTES.DASHBOARD_SCHEDULER,
    ROUTES.DASHBOARD_SCHEDULES,
    ROUTES.DASHBOARD_SESSIONS,
    ROUTES.DASHBOARD_NOTIFICATIONS,
  ],
  recepcionista: [
    ROUTES.DASHBOARD,
    ROUTES.DASHBOARD_APPOINTMENTS,
    ROUTES.DASHBOARD_CLIENTS,
    ROUTES.DASHBOARD_SERVICES,
    ROUTES.DASHBOARD_PAYMENTS,
    ROUTES.DASHBOARD_SCHEDULER,
    ROUTES.DASHBOARD_SCHEDULES,
    ROUTES.DASHBOARD_SESSIONS,
    ROUTES.DASHBOARD_NOTIFICATIONS,
  ],
  cliente: [
    ROUTES.DASHBOARD,
    ROUTES.DASHBOARD_APPOINTMENTS,
    ROUTES.DASHBOARD_FACIAL_ANALYSIS,
    ROUTES.DASHBOARD_REVIEWS,
    ROUTES.DASHBOARD_SESSIONS,
    ROUTES.DASHBOARD_NOTIFICATIONS,
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
