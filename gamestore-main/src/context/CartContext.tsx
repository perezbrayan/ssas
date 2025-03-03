import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
  mainId: string;
  offerId: string;
  displayName: string;
  displayDescription: string;
  price: {
    regularPrice: number;
    finalPrice: number;
    floorPrice: number;
  };
  rarity: {
    id: string;
    name: string;
  };
  displayAssets: {
    full_background: string;
    background: string;
  }[];
  categories: string[];
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  hasItems: boolean;
  addItem: (item: CartItem) => { success: boolean; message?: string };
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  getItemQuantity: (itemId: string) => number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const hasItems = items.length > 0;

  const addItem = (newItem: CartItem) => {
    if (hasItems) {
      return {
        success: false,
        message: "No es posible enviar dos regalos simultáneamente"
      };
    }

    setItems([{ ...newItem, quantity: 1 }]);
    setIsOpen(true);
    return { success: true };
  };

  const removeItem = (itemId: string) => {
    setItems(currentItems =>
      currentItems.filter(item => item.mainId !== itemId)
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getItemQuantity = (itemId: string) => {
    return items.find(item => item.mainId === itemId)?.quantity || 0;
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen(prev => !prev);

  return (
    <CartContext.Provider 
      value={{ 
        items, 
        isOpen,
        hasItems,
        addItem, 
        removeItem, 
        clearCart, 
        getItemQuantity,
        openCart,
        closeCart,
        toggleCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
