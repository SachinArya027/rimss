import { collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';

// Sample products data
const sampleProducts = [
  {
    name: "Classic Moleskin Jacket",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=500&h=500",
    isFeatured: true,
    discount: 20,
    category: "men",
    description: "A timeless moleskin jacket that combines durability with style. Perfect for cooler days.",
    stock: 15,
    color: "brown"
  },
  {
    name: "Corduroy Trousers",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=500&h=500",
    isFeatured: true,
    category: "men",
    description: "Comfortable and stylish corduroy trousers that work well for casual and semi-formal occasions.",
    stock: 25,
    color: "blue"
  },
  {
    name: "Tattersall Shirt",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=500&h=500",
    isFeatured: true,
    discount: 15,
    category: "men",
    description: "A classic tattersall check shirt made from premium cotton for comfort and durability.",
    stock: 30,
    color: "white"
  },
  {
    name: "Wool Sweater",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=500&h=500",
    isFeatured: true,
    category: "men",
    description: "A warm and comfortable wool sweater, perfect for layering during colder months.",
    stock: 20,
    color: "grey"
  },
  {
    name: "Silk Blouse",
    price: 119.99,
    image: "https://images.unsplash.com/photo-1551489186-cf8726f514f8?auto=format&fit=crop&w=500&h=500",
    isFeatured: false,
    discount: 10,
    category: "women",
    description: "An elegant silk blouse that transitions seamlessly from office to evening wear.",
    stock: 18,
    color: "red"
  },
  {
    name: "Leather Handbag",
    price: 249.99,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=500&h=500",
    isFeatured: false,
    category: "accessories",
    description: "A premium leather handbag with multiple compartments and elegant design.",
    stock: 12,
    color: "black"
  },
  {
    name: "Cashmere Scarf",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1520903920243-1d5cdb3840cf?auto=format&fit=crop&w=500&h=500",
    isFeatured: false,
    discount: 5,
    category: "accessories",
    description: "A luxuriously soft cashmere scarf that adds elegance to any outfit.",
    stock: 22,
    color: "green"
  },
  {
    name: "Linen Dress",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=500&h=500",
    isFeatured: false,
    category: "women",
    description: "A breezy linen dress perfect for summer days and warm evenings.",
    stock: 15,
    color: "white"
  }
];

// Sample offers data
const sampleOffers = [
  {
    title: "Summer Collection Sale",
    description: "Get up to 50% off on our latest summer collection. Limited time offer!",
    image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=800&h=400",
    discount: "50% OFF",
    validUntil: "2025-06-15",
    category: "seasonal",
    isActive: true
  },
  {
    title: "New Season Arrivals",
    description: "Discover our fresh new styles for the upcoming season. Shop now!",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&h=400",
    discount: "NEW",
    validUntil: "2025-06-20",
    category: "new-arrivals",
    isActive: true
  },
  {
    title: "Premium Collection",
    description: "Exclusive deals on our premium range. Luxury meets affordability.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&h=400",
    discount: "30% OFF",
    validUntil: "2025-06-12",
    category: "premium",
    isActive: true
  }
];

// Function to check if collection is empty
const isCollectionEmpty = async (collectionName: string): Promise<boolean> => {
  const snapshot = await getDocs(collection(db, collectionName));
  return snapshot.empty;
};

// Function to clear existing data
const clearCollection = async (collectionName: string): Promise<void> => {
  const snapshot = await getDocs(collection(db, collectionName));
  const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
  console.log(`Cleared ${snapshot.docs.length} documents from ${collectionName}`);
};

// Function to initialize products
const initializeProducts = async (forceReset = false): Promise<void> => {
  const isEmpty = await isCollectionEmpty('products');
  
  if (!isEmpty && !forceReset) {
    console.log('Products collection already contains data. Skipping initialization.');
    return;
  }
  
  if (!isEmpty && forceReset) {
    await clearCollection('products');
  }
  
  const productsCollection = collection(db, 'products');
  const addPromises = sampleProducts.map(product => addDoc(productsCollection, product));
  await Promise.all(addPromises);
  console.log(`Added ${sampleProducts.length} products to Firestore.`);
};

// Function to initialize offers
const initializeOffers = async (forceReset = false): Promise<void> => {
  const isEmpty = await isCollectionEmpty('offers');
  
  if (!isEmpty && !forceReset) {
    console.log('Offers collection already contains data. Skipping initialization.');
    return;
  }
  
  if (!isEmpty && forceReset) {
    await clearCollection('offers');
  }
  
  const offersCollection = collection(db, 'offers');
  const addPromises = sampleOffers.map(offer => addDoc(offersCollection, offer));
  await Promise.all(addPromises);
  console.log(`Added ${sampleOffers.length} offers to Firestore.`);
};

// Main initialization function
export const initializeFirestore = async (forceReset = false): Promise<void> => {
  try {
    console.log('Starting Firestore initialization...');
    await initializeProducts(forceReset);
    await initializeOffers(forceReset);
    console.log('Firestore initialization completed successfully.');
  } catch (error) {
    console.error('Error initializing Firestore:', error);
    throw error;
  }
};
