import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { auth, googleProvider } from '../firebase/firebase';
import { 
  signOut, 
  onAuthStateChanged,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  AuthErrorCodes
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
    // Set persistence to LOCAL (survives browser restarts)
    setPersistence(auth, browserLocalPersistence)
      .catch(err => {
        console.error('Error setting auth persistence:', err);
      });

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    }, (error) => {
      console.error('Auth state change error:', error);
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
    } catch (err: unknown) {
      // Type guard for Firebase Auth errors
      const firebaseError = err as { code?: string; message?: string };
      // Use AuthErrorCodes for better error handling
      const errorCode = firebaseError.code;
      let errorMessage = 'An unknown error occurred';
      
      // Handle specific Firebase auth errors
      if (errorCode === AuthErrorCodes.POPUP_BLOCKED) {
        setIsPopupBlocked(true);
        errorMessage = 'Popup was blocked by the browser. Please allow popups for this site or try signing in with a different method.';
      } else if (errorCode === AuthErrorCodes.POPUP_CLOSED_BY_USER) {
        errorMessage = 'Sign-in popup was closed before completing the sign in.';
      } else if (errorCode === AuthErrorCodes.NETWORK_REQUEST_FAILED) {
        errorMessage = 'Network error occurred. Please check your internet connection and try again.';
      } else if (firebaseError.message) {
        errorMessage = firebaseError.message;
      }
      
      setError(errorMessage);
      console.error('Google sign-in error:', { code: errorCode, message: errorMessage });
      throw err;
    }
  };

  // Sign in with email and password
  const loginWithEmail = async (email: string, password: string): Promise<User> => {
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (err: unknown) {
      const firebaseError = err as { code?: string; message?: string };
      let errorMessage = 'An unknown error occurred';
      
      // Handle specific Firebase auth errors
      if (firebaseError.code === AuthErrorCodes.INVALID_LOGIN_CREDENTIALS) {
        errorMessage = 'Invalid email or password. Please try again.';
      } else if (firebaseError.code === AuthErrorCodes.USER_DELETED) {
        errorMessage = 'Account not found. Please check your email or create a new account.';
      } else if (firebaseError.code === AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER) {
        errorMessage = 'Too many failed attempts. Please try again later or reset your password.';
      } else if (firebaseError.message) {
        errorMessage = firebaseError.message;
      }
      
      setError(errorMessage);
      console.error('Email login error:', { code: firebaseError.code, message: errorMessage });
      throw err;
    }
  };

  // Sign up with email and password
  const registerWithEmail = async (email: string, password: string): Promise<User> => {
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (err: unknown) {
      const firebaseError = err as { code?: string; message?: string };
      let errorMessage = 'An unknown error occurred';
      
      // Handle specific Firebase auth errors
      if (firebaseError.code === AuthErrorCodes.EMAIL_EXISTS) {
        errorMessage = 'Email already in use. Please try logging in or use a different email.';
      } else if (firebaseError.code === AuthErrorCodes.WEAK_PASSWORD) {
        errorMessage = 'Password is too weak. Please use a stronger password.';
      } else if (firebaseError.code === AuthErrorCodes.INVALID_EMAIL) {
        errorMessage = 'Invalid email address. Please check and try again.';
      } else if (firebaseError.message) {
        errorMessage = firebaseError.message;
      }
      
      setError(errorMessage);
      console.error('Email registration error:', { code: firebaseError.code, message: errorMessage });
      throw err;
    }
  };

  const logout = async (): Promise<void> => {
    setError(null);
    try {
      await signOut(auth);
    } catch (err: unknown) {
      const firebaseError = err as { code?: string; message?: string };
      const errorMessage = firebaseError.message || 'An unknown error occurred during logout';
      setError(errorMessage);
      console.error('Logout error:', { code: firebaseError.code, message: errorMessage });
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
