import { 
  collection, 
  getDocs, 
  query, 
  where, 
  limit, 
  doc, 
  getDoc
} from 'firebase/firestore';
import type { QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from './firebase';

// Product type definition
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  isFeatured: boolean;
  discount?: number;
  category?: string;
  description?: string;
  stock?: number;
}

// Offer type definition
export interface Offer {
  id: string;
  title: string;
  description: string;
  image: string;
  discount: string;
  validUntil: string;
  category?: string;
  isActive?: boolean;
}

// Convert Firestore document to Product
const productConverter = {
  fromFirestore(snapshot: QueryDocumentSnapshot): Product {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      name: data.name,
      price: data.price,
      image: data.image,
      isFeatured: data.isFeatured,
      discount: data.discount,
      category: data.category,
      description: data.description,
      stock: data.stock
    };
  }
};

// Convert Firestore document to Offer
const offerConverter = {
  fromFirestore(snapshot: QueryDocumentSnapshot): Offer {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      title: data.title,
      description: data.description,
      image: data.image,
      discount: data.discount,
      validUntil: data.validUntil,
      category: data.category,
      isActive: data.isActive
    };
  }
};

// Get all products
export const getProducts = async (): Promise<Product[]> => {
  const productsCollection = collection(db, 'products');
  const productsSnapshot = await getDocs(productsCollection);
  return productsSnapshot.docs.map(doc => productConverter.fromFirestore(doc));
};

// Get featured products
export const getFeaturedProducts = async (limitCount = 4): Promise<Product[]> => {
  const productsCollection = collection(db, 'products');
  const featuredQuery = query(
    productsCollection,
    where('isFeatured', '==', true),
    limit(limitCount)
  );
  const productsSnapshot = await getDocs(featuredQuery);
  return productsSnapshot.docs.map(doc => productConverter.fromFirestore(doc));
};

// Get product by ID
export const getProductById = async (productId: string): Promise<Product | null> => {
  const productDoc = doc(db, 'products', productId);
  const productSnapshot = await getDoc(productDoc);
  
  if (productSnapshot.exists()) {
    return {
      id: productSnapshot.id,
      ...productSnapshot.data()
    } as Product;
  }
  
  return null;
};

// Get all offers
export const getOffers = async (): Promise<Offer[]> => {
  const offersCollection = collection(db, 'offers');
  const offersSnapshot = await getDocs(offersCollection);
  return offersSnapshot.docs.map(doc => offerConverter.fromFirestore(doc));
};

// Get active offers
export const getActiveOffers = async (limitCount = 3): Promise<Offer[]> => {
  const offersCollection = collection(db, 'offers');
  const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
  
  // Use a simpler query that doesn't require a composite index
  // Just filter by isActive and get all active offers
  const activeOffersQuery = query(
    offersCollection,
    where('isActive', '==', true)
  );
  
  const offersSnapshot = await getDocs(activeOffersQuery);
  
  // Filter and sort in memory instead of in the query
  const validOffers = offersSnapshot.docs
    .map(doc => offerConverter.fromFirestore(doc))
    .filter(offer => offer.validUntil >= today)
    .sort((a, b) => a.validUntil.localeCompare(b.validUntil))
    .slice(0, limitCount);
    
  return validOffers;
};

// Get offer by ID
export const getOfferById = async (offerId: string): Promise<Offer | null> => {
  const offerDoc = doc(db, 'offers', offerId);
  const offerSnapshot = await getDoc(offerDoc);
  
  if (offerSnapshot.exists()) {
    return {
      id: offerSnapshot.id,
      ...offerSnapshot.data()
    } as Offer;
  }
  
  return null;
};
