import { createContext } from 'react';

export interface CartContextType {
  addToCart: (productId: number, options?: { color?: string; memory?: string }) => Promise<void>;
  cart?: any;
  setCart?: (cart: any) => void;
}

export const CartContext = createContext<CartContextType>({
  addToCart: async () => {},
  cart: undefined,
});
