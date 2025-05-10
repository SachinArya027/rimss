import { useContext } from 'react';
import CartContext from './CartContext';

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext);
