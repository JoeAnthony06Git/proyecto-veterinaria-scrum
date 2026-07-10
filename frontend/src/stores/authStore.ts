import { create } from 'zustand';
import { authApi } from '../services/api';
import type { UserDto } from '../types';

function decodeToken(token: string): { exp: number } | null {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded) return true;
  return Date.now() >= decoded.exp * 1000;
}

const ERROR_MESSAGES: Record<number, string> = {
  400: 'Datos inválidos, verifica los campos',
  401: 'Credenciales inválidas',
  409: 'Este correo electrónico ya está registrado',
};

function getErrorMessage(err: unknown, defaultMsg: string): string {
  const axiosError = err as { response?: { status?: number; data?: { message?: string } } };
  const status = axiosError.response?.status;
  if (status && ERROR_MESSAGES[status]) return ERROR_MESSAGES[status];
  return axiosError.response?.data?.message || defaultMsg;
}

interface AuthState {
  user: UserDto | null;
  token: string | null;
  loginLoading: boolean;
  registerLoading: boolean;
  sessionLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; lastName: string; email: string; phone: string; password: string }) => Promise<void>;
  logout: () => void;
  initSession: () => Promise<void>;
  clearError: () => void;
}

let sessionTimerId: ReturnType<typeof setInterval> | null = null;

function stopSessionTimer() {
  if (sessionTimerId !== null) {
    clearInterval(sessionTimerId);
    sessionTimerId = null;
  }
}

function startSessionTimer(getState: () => AuthState) {
  stopSessionTimer();
  sessionTimerId = setInterval(() => {
    const { token, logout } = getState();
    if (token && isTokenExpired(token)) {
      logout();
      window.location.href = '/login';
    }
  }, 30000);
}

export const useAuthStore = create<AuthState>((set, get) => {
  const storedToken = localStorage.getItem('token');
  if (storedToken && isTokenExpired(storedToken)) {
    localStorage.removeItem('token');
  }

  const initialToken = localStorage.getItem('token');

  if (initialToken) {
    startSessionTimer(get);
  }

  return {
    user: null,
    token: initialToken,
    loginLoading: false,
    registerLoading: false,
    sessionLoading: !!initialToken,
    error: null,

    login: async (email, password) => {
      set({ loginLoading: true, error: null });
      try {
        const { data } = await authApi.login(email, password);
        localStorage.setItem('token', data.token);
        startSessionTimer(get);
        set({ user: data.user, token: data.token, loginLoading: false });
      } catch (err: unknown) {
        const message = getErrorMessage(err, 'Error al iniciar sesión');
        set({ error: message, loginLoading: false });
        throw err;
      }
    },

    register: async (registerData) => {
      set({ registerLoading: true, error: null });
      try {
        const { data } = await authApi.register(registerData);
        localStorage.setItem('token', data.token);
        startSessionTimer(get);
        set({ user: data.user, token: data.token, registerLoading: false });
      } catch (err: unknown) {
        const message = getErrorMessage(err, 'Error al registrarse');
        set({ error: message, registerLoading: false });
        throw err;
      }
    },

    logout: () => {
      stopSessionTimer();
      localStorage.removeItem('token');
      set({ user: null, token: null, loginLoading: false, registerLoading: false, sessionLoading: false });
    },

    initSession: async () => {
      const token = localStorage.getItem('token');
      if (!token || isTokenExpired(token)) {
        localStorage.removeItem('token');
        set({ user: null, token: null, sessionLoading: false });
        return;
      }
      set({ sessionLoading: true });
      try {
        const { data } = await authApi.profile();
        startSessionTimer(get);
        set({ user: data, token, sessionLoading: false });
      } catch {
        localStorage.removeItem('token');
        set({ user: null, token: null, sessionLoading: false });
      }
    },

    clearError: () => set({ error: null }),
  };
});
