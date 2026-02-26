import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Address } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  addresses: Address[];
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  setAddresses: (addresses: Address[]) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      addresses: [],
      isAuthenticated: false,

      setAuth: (user, token) => {
        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true });
      },

      setAddresses: (addresses) => set({ addresses }),

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, addresses: [], isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);
