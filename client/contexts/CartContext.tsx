import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  supplierId: string;
  supplierName: string;
  productName: string;
  category: string;
  price: number;
  quantity: number;
  unit: string;
  image: string;
  minOrder?: number;
  maxOrder?: number;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (id: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('streetSupplyCart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch {
        localStorage.removeItem('streetSupplyCart');
      }
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('streetSupplyCart', JSON.stringify(items));
  }, [items]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const addItem = (newItem: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    const quantity = newItem.quantity || 1;
    
    setItems(currentItems => {
      const existingItemIndex = currentItems.findIndex(item => item.id === newItem.id);
      
      if (existingItemIndex > -1) {
        // Update quantity of existing item
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
        return updatedItems;
      } else {
        // Add new item
        return [...currentItems, { ...newItem, quantity }];
      }
    });
  };

  const removeItem = (id: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const isInCart = (id: string) => {
    return items.some(item => item.id === id);
  };

  return (
    <CartContext.Provider value={{
      items,
      totalItems,
      totalAmount,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      isInCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
