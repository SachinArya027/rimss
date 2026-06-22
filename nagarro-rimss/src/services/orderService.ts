import { collection, addDoc, query, where, getDocs, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import type { CartItem } from '../contexts/CartContext';

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  discount?: number;
  quantity: number;
  image: string;
}

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

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
  const orderItems: OrderItem[] = cartItems.map(item => ({
    productId: item.product.id || 'unknown-id',
    name: item.product.name || 'Unnamed Product',
    price: item.product.price || 0,
    ...(item.product.discount !== undefined && { discount: item.product.discount }),
    quantity: item.quantity || 1,
    image: item.product.images && item.product.images.length > 0 ? item.product.images[0] : ''
  }));

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

  const orderRef = await addDoc(collection(db, 'orders'), order);
  return orderRef.id;
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
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
};

export const getOrderById = async (orderId: string): Promise<Order | null> => {
  const orderDoc = await getDoc(doc(db, 'orders', orderId));
  
  if (orderDoc.exists()) {
    return {
      id: orderDoc.id,
      ...orderDoc.data()
    } as Order;
  }
  
  return null;
};
