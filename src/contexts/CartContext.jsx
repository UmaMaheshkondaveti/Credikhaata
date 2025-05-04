
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const initialState = {
  items: [],
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(initialState);
  const { toast } = useToast();

  // Load cart from localStorage on initial render
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        // Basic validation
        if (parsedCart && Array.isArray(parsedCart.items)) {
           setCart(parsedCart);
        } else {
           localStorage.removeItem('cart'); // Clear invalid data
        }
      } catch (error) {
        console.error("Failed to parse cart from localStorage", error);
        localStorage.removeItem('cart'); // Clear corrupted data
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart !== initialState) { // Avoid saving initial empty state unnecessarily
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.items.findIndex(item => item.id === product.id);
      let newItems;

      if (existingItemIndex > -1) {
        // Update quantity if item exists
        newItems = prevCart.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        newItems = [...prevCart.items, { ...product, quantity }];
      }
      toast({
        title: "Item Added",
        description: `${product.title} added to cart.`,
        duration: 3000,
      });
      return { ...prevCart, items: newItems };
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => {
      const itemToRemove = prevCart.items.find(item => item.id === productId);
      const newItems = prevCart.items.filter(item => item.id !== productId);
       if (itemToRemove) {
         toast({
           title: "Item Removed",
           description: `${itemToRemove.title} removed from cart.`,
           variant: "destructive",
           duration: 3000,
         });
       }
      return { ...prevCart, items: newItems };
    });
  };

  const updateQuantity = (productId, quantity) => {
    setCart(prevCart => {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        return { ...prevCart, items: prevCart.items.filter(item => item.id !== productId) };
      }
      // Update quantity
      const newItems = prevCart.items.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
      return { ...prevCart, items: newItems };
    });
  };

  const clearCart = () => {
    setCart(initialState);
     localStorage.removeItem('cart');
     toast({
       title: "Cart Cleared",
       description: "All items removed from cart.",
       variant: "destructive",
       duration: 3000,
     });
  };

  const getCartTotal = () => {
    return cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemCount = () => {
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    cartItems: cart.items,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
  