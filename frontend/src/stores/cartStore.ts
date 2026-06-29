import { create } from 'zustand';
import { cartApi } from '../services/api';
import type { CartItemDto } from '../types';

interface CartState {
  items: CartItemDto[];
  loading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  checkout: () => Promise<void>;
  clearError: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  loading: false,
  error: null,

  fetchCart: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await cartApi.list();
      set({ items: data, loading: false });
    } catch {
      set({ error: 'Error al cargar carrito', loading: false });
    }
  },

  addItem: async (productId, quantity = 1) => {
    set({ loading: true, error: null });
    try {
      const { data } = await cartApi.addItem(productId, quantity);
      set((state) => ({ items: [...state.items, data], loading: false }));
    } catch {
      set({ error: 'Error al agregar al carrito', loading: false });
    }
  },

  updateQuantity: async (itemId, quantity) => {
    try {
      await cartApi.updateItem(itemId, quantity);
      set((state) => ({
        items: state.items.map((item) =>
          item.id === itemId ? { ...item, quantity } : item,
        ),
      }));
    } catch {
      set({ error: 'Error al actualizar cantidad' });
    }
  },

  removeItem: async (itemId) => {
    try {
      await cartApi.removeItem(itemId);
      set((state) => ({
        items: state.items.filter((item) => item.id !== itemId),
      }));
    } catch {
      set({ error: 'Error al eliminar del carrito' });
    }
  },

  checkout: async () => {
    set({ loading: true, error: null });
    try {
      await cartApi.checkout();
      set({ items: [], loading: false });
    } catch {
      set({ error: 'Error al procesar pago', loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
