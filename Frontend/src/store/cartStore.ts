import { create } from 'zustand';
import type { Cart } from '@/types';
import { cartApi } from '@/api/services';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  isOpen: boolean;
  fetchCart: () => Promise<void>;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (productId: string, quantity: number, size: string) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  isLoading: false,
  isOpen: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const res = await cartApi.get();
      set({ cart: res.data.cart });
    } catch {
      // Cart might not exist yet
    } finally {
      set({ isLoading: false });
    }
  },

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

  addItem: async (productId, quantity, size) => {
    const res = await cartApi.add({ productId, quantity, size });
    set({ cart: res.data.cart });
  },

  updateItem: async (itemId, quantity) => {
    const res = await cartApi.update(itemId, quantity);
    set({ cart: res.data.cart });
  },

  removeItem: async (itemId) => {
    const res = await cartApi.remove(itemId);
    set({ cart: res.data.cart });
  },

  clearCart: async () => {
    await cartApi.clear();
    set({ cart: null });
  },
}));
