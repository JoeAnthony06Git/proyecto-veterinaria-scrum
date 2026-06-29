import { create } from 'zustand';
import { authApi } from '../services/api';
import type { UserDto } from '../types';

interface AuthState {
  user: UserDto | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; lastName: string; email: string; phone: string; password: string }) => Promise<void>;
  logout: () => void;
  loadSession: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await authApi.login(email, password);
      localStorage.setItem('token', data.token);
      set({ user: data.user, token: data.token, loading: false });
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error al iniciar sesión';
      set({ error: message, loading: false });
      throw err;
    }
  },

  register: async (registerData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await authApi.register(registerData);
      localStorage.setItem('token', data.token);
      set({ user: data.user, token: data.token, loading: false });
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error al registrarse';
      set({ error: message, loading: false });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  loadSession: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    set({ loading: true });
    try {
      const { data } = await authApi.profile();
      set({ user: data, token, loading: false });
    } catch {
      localStorage.removeItem('token');
      set({ user: null, token: null, loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
