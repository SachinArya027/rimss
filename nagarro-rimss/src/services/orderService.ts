import { collection, addDoc, query, where, getDocs, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import type { CartItem } from '../contexts/CartContext';

// Order status types
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

// Order item interface
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  discount?: number;
  quantity: number;
  image: string;
}

// Shipping address interface
export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// Order interface
export interface Order {
  id?: string;
  userId: string;
  orderDate: string;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentId: string;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  status: OrderStatus;
}

/**
 * Creates a new order in Firestore
 * @param userId User ID
 * @param cartItems Cart items to be ordered
 * @param shippingAddress Shipping address
 * @param paymentDetails Payment details
 * @returns The created order ID
 */
export const createOrder = async (
  userId: string,
  cartItems: CartItem[],
  shippingAddress: ShippingAddress,
  paymentMethod: string,
  paymentId: string,
  subtotal: number,
  shippingCost: number,
  discount: number,
  total: number
): Promise<string> => {
  try {
    // Convert cart items to order items
    const orderItems: OrderItem[] = cartItems.map(item => {
      // Ensure no undefined values are sent to Firestore
      return {
        productId: item.product.id || 'unknown-id',
        name: item.product.name || 'Unnamed Product',
        price: item.product.price || 0,
        // Only include discount if it exists
        ...(item.product.discount !== undefined && { discount: item.product.discount }),
        quantity: item.quantity || 1,
        image: item.product.images && item.product.images.length > 0 ? item.product.images[0] : ''
      };
    });

    // Create order object with safe values (no undefined)
    const order: Omit<Order, 'id'> = {
      userId: userId || 'anonymous',
      orderDate: new Date().toISOString(),
      orderItems,
      shippingAddress: {
        fullName: shippingAddress.fullName || 'Customer',
        addressLine1: shippingAddress.addressLine1 || '',
        ...(shippingAddress.addressLine2 && { addressLine2: shippingAddress.addressLine2 }),
        city: shippingAddress.city || '',
        state: shippingAddress.state || '',
        postalCode: shippingAddress.postalCode || '',
        country: shippingAddress.country || ''
      },
      paymentMethod: paymentMethod || 'Credit Card',
      paymentId: paymentId || 'unknown',
      subtotal: subtotal || 0,
      shippingCost: shippingCost || 0,
      discount: discount || 0,
      total: total || 0,
      status: 'completed'
    };

    // Add order to Firestore
    const orderRef = await addDoc(collection(db, 'orders'), order);
    return orderRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

/**
 * Gets all orders for a specific user
 * @param userId User ID
 * @returns Array of orders
 */
export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    const ordersQuery = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      orderBy('orderDate', 'desc')
    );
    
    const snapshot = await getDocs(ordersQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Order));
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

/**
 * Gets a specific order by ID
 * @param orderId Order ID
 * @returns Order object
 */
export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const orderDoc = await getDoc(doc(db, 'orders', orderId));
    
    if (orderDoc.exists()) {
      return {
        id: orderDoc.id,
        ...orderDoc.data()
      } as Order;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};
