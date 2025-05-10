import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { firebaseConfig } from './config';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with proper configuration
export const auth = getAuth(app);
auth.useDeviceLanguage(); // Set language to user's device language

// Initialize other Firebase services
export const db = getFirestore(app);

// Initialize Analytics only if supported (prevents errors in environments where analytics is blocked)
export const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);

// Google Auth Provider with improved configuration
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
  // Adding these parameters can help with authentication flows
  auth_type: 'rerequest',
  include_granted_scopes: 'true'
});
