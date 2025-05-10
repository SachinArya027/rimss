import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Product } from '../firebase/firestoreService';

// Define the cart item type
export interface CartItem {
  product: Product;
  quantity: number;
}

// Define the cart context type
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

// Create the context with default values
const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  totalPrice: 0,
});

// Load cart items from localStorage
const loadCartFromStorage = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return [];
  }
};

// Save cart items to localStorage
const saveCartToStorage = (items: CartItem[]) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('cart', JSON.stringify(items));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

// Create the provider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(loadCartFromStorage());
  
  // Save cart items to localStorage whenever they change
  useEffect(() => {
    saveCartToStorage(cartItems);
  }, [cartItems]);

  // Calculate total items
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => {
    const price = item.product.discount
      ? item.product.price * (1 - item.product.discount / 100)
      : item.product.price;
    return total + price * item.quantity;
  }, 0);

  // Add a product to the cart
  const addToCart = (product: Product, quantity: number) => {
    setCartItems((prevItems) => {
      // Check if product already exists in cart
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product.id === product.id
      );

      if (existingItemIndex !== -1) {
        // Update quantity if product exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // Add new item if product doesn't exist
        return [...prevItems, { product, quantity }];
      }
    });
  };

  // Remove a product from the cart
  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.product.id !== productId)
    );
  };

  // Update quantity of a product in the cart
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Clear the cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Value to be provided to consumers
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Context export
export default CartContext;
