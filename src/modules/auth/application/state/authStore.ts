import { create } from 'zustand';
import type { Auth } from '../../domain/models/Auth';
import type { User } from '../../domain/models/User';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (auth: Auth, user?: User) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  setAuth: (auth, user) =>
    set({
      token: auth.token,
      user: user ?? null,
      isAuthenticated: true,
    }),
  setUser: (user) => set({ user }),
  logout: () =>
    set({
      token: null,
      user: null,
      isAuthenticated: false,
    }),
}));
