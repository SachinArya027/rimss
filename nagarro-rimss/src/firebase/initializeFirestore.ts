import { collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { sampleProducts, sampleOffers, sampleOrders } from './seedData';

const isCollectionEmpty = async (collectionName: string): Promise<boolean> => {
  const snapshot = await getDocs(collection(db, collectionName));
  return snapshot.empty;
};

const clearCollection = async (collectionName: string): Promise<void> => {
  const snapshot = await getDocs(collection(db, collectionName));
  await Promise.all(snapshot.docs.map(doc => deleteDoc(doc.ref)));
};

const initializeProducts = async (forceReset = false): Promise<void> => {
  const isEmpty = await isCollectionEmpty('products');
  if (!isEmpty && !forceReset) return;
  if (!isEmpty && forceReset) await clearCollection('products');

  const productsCollection = collection(db, 'products');
  await Promise.all(sampleProducts.map(product => addDoc(productsCollection, product)));
};

const initializeOffers = async (forceReset = false): Promise<void> => {
  const isEmpty = await isCollectionEmpty('offers');
  if (!isEmpty && !forceReset) return;
  if (!isEmpty && forceReset) await clearCollection('offers');

  const offersCollection = collection(db, 'offers');
  await Promise.all(sampleOffers.map(offer => addDoc(offersCollection, offer)));
};

const initializeOrders = async (forceReset = false): Promise<void> => {
  const isEmpty = await isCollectionEmpty('orders');
  if (!isEmpty && !forceReset) return;
  if (!isEmpty && forceReset) await clearCollection('orders');

  const ordersCollection = collection(db, 'orders');
  await Promise.all(sampleOrders.map(order => addDoc(ordersCollection, order)));
};

export const initializeFirestore = async (forceReset = false): Promise<void> => {
  try {
    await initializeProducts(forceReset);
    await initializeOffers(forceReset);
    await initializeOrders(forceReset);
  } catch (error) {
    console.error('Error initializing Firestore:', error);
    throw error;
  }
};
