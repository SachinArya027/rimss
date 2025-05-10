import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { auth, googleProvider } from '../firebase/firebase';
import { 
  signOut, 
  onAuthStateChanged,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { AuthContext } from './AuthContext';
import type { AuthContextType } from './AuthContext';

interface AuthProviderProps {
  children: ReactNode;
}

// This file only exports the AuthProvider component
const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPopupBlocked, setIsPopupBlocked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async (): Promise<User> => {
    setError(null);
    setIsPopupBlocked(false);
    try {
      // First, make sure we're responding to a user interaction
      // This helps prevent popup blocking
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      
      // Handle popup blocked error specifically
      if (errorMessage.includes('auth/popup-blocked')) {
        setIsPopupBlocked(true);
        setError('Popup was blocked by the browser. Please allow popups for this site or try signing in with a different method.');
      } else {
        setError(errorMessage);
      }
      
      throw err;
    }
  };

  // Sign in with email and password
  const loginWithEmail = async (email: string, password: string): Promise<User> => {
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      throw err;
    }
  };

  // Sign up with email and password
  const registerWithEmail = async (email: string, password: string): Promise<User> => {
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      throw err;
    }
  };

  const logout = async (): Promise<void> => {
    setError(null);
    try {
      await signOut(auth);
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      throw err;
    }
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    signInWithGoogle,
    loginWithEmail,
    registerWithEmail,
    logout,
    error,
    isPopupBlocked
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
