import { create } from 'zustand';
import { User, CartItem } from '@/types';

interface Store {
  user: User | null;
  setUser: (user: User | null) => void;
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
  cartCount: number;
  updateCartCount: () => void;
}

export const useStore = create<Store>((set, get) => ({
  user: null,
  setUser: (user) => set({ user }),
  cart: [],
  setCart: (cart) => {
    set({ cart });
    get().updateCartCount();
  },
  cartCount: 0,
  updateCartCount: () => {
    const cart = get().cart;
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    set({ cartCount: count });
  },
}));
