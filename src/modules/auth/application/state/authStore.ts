import { create } from "zustand";

export type UserRole = "administrador" | "estilista" | "recepcionista" | "cliente";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

const getStoredUser = (): User | null => {
  try {
    const stored = localStorage.getItem("auth-storage");
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.state?.user || null;
    }
  } catch (error) {
    console.error("Error loading user from storage:", error);
  }
  return null;
};

const storedUser = getStoredUser();

export const useAuthStore = create<AuthState>((set) => ({
  user: storedUser,
  isLoading: false,
  isAuthenticated: storedUser !== null,

  login: async (email: string, _password: string, role: UserRole) => {
    set({ isLoading: true });

    const mockUsers: Record<UserRole, User> = {
      administrador: {
        id: "1",
        name: "María González",
        email: email,
        role: "administrador",
      },
      estilista: {
        id: "2",
        name: "Laura García",
        email: email,
        role: "estilista",
      },
      recepcionista: {
        id: "3",
        name: "Ana Martínez",
        email: email,
        role: "recepcionista",
      },
      cliente: {
        id: "4",
        name: "Carlos Ruiz",
        email: email,
        role: "cliente",
      },
    };

    const loggedUser = mockUsers[role];

    try {
      localStorage.setItem("auth-storage", JSON.stringify({ state: { user: loggedUser } }));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }

    set({ user: loggedUser, isLoading: false, isAuthenticated: true });
  },

  logout: () => {
    try {
      localStorage.removeItem("auth-storage");
    } catch (error) {
      console.error("Error removing from localStorage:", error);
    }
    set({ user: null, isAuthenticated: false });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));

export const rolePermissions: Record<UserRole, string[]> = {
  administrador: [
    "/dashboard",
    "/dashboard/appointments",
    "/dashboard/clients",
    "/dashboard/services",
    "/dashboard/facial-analysis",
    "/dashboard/reports",
    "/dashboard/settings",
  ],
  estilista: [
    "/dashboard",
    "/dashboard/appointments",
    "/dashboard/clients",
    "/dashboard/services",
    "/dashboard/facial-analysis",
  ],
  recepcionista: [
    "/dashboard",
    "/dashboard/appointments",
    "/dashboard/clients",
    "/dashboard/services",
  ],
  cliente: [
    "/dashboard",
    "/dashboard/appointments",
    "/dashboard/facial-analysis",
  ],
};

export function hasPermission(role: UserRole | undefined, path: string): boolean {
  if (!role) return false;
  return rolePermissions[role].some((allowedPath) => {
    if (path === allowedPath) return true;
    // Sub-path match only for specific routes (not the base /dashboard)
    if (allowedPath === "/dashboard") return false;
    return path.startsWith(allowedPath + "/");
  });
}