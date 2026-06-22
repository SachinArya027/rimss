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

type FirebaseError = { code?: string; message?: string };

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPopupBlocked, setIsPopupBlocked] = useState(false);

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
      .catch(err => console.error('Error setting auth persistence:', err));

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    }, (authError) => {
      console.error('Auth state change error:', authError);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleAuthError = (err: unknown, errorMap: Record<string, string>, defaultMessage = 'An unknown error occurred'): never => {
    const firebaseError = err as FirebaseError;
    const errorCode = firebaseError.code;
    let errorMessage = defaultMessage;

    if (errorCode && errorMap[errorCode]) {
      errorMessage = errorMap[errorCode];
    } else if (firebaseError.message) {
      errorMessage = firebaseError.message;
    }

    if (errorCode === AuthErrorCodes.POPUP_BLOCKED) {
      setIsPopupBlocked(true);
    }

    setError(errorMessage);
    console.error('Auth error:', { code: errorCode, message: errorMessage });
    throw err;
  };

  const signInWithGoogle = async (): Promise<User> => {
    setError(null);
    setIsPopupBlocked(false);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (err) {
      return handleAuthError(err, {
        [AuthErrorCodes.POPUP_BLOCKED]: 'Popup was blocked by the browser. Please allow popups for this site or try signing in with a different method.',
        [AuthErrorCodes.POPUP_CLOSED_BY_USER]: 'Sign-in popup was closed before completing the sign in.',
        [AuthErrorCodes.NETWORK_REQUEST_FAILED]: 'Network error occurred. Please check your internet connection and try again.',
      });
    }
  };

  const loginWithEmail = async (email: string, password: string): Promise<User> => {
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (err) {
      return handleAuthError(err, {
        [AuthErrorCodes.INVALID_LOGIN_CREDENTIALS]: 'Invalid email or password. Please try again.',
        [AuthErrorCodes.USER_DELETED]: 'Account not found. Please check your email or create a new account.',
        [AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER]: 'Too many failed attempts. Please try again later or reset your password.',
      });
    }
  };

  const registerWithEmail = async (email: string, password: string): Promise<User> => {
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (err) {
      return handleAuthError(err, {
        [AuthErrorCodes.EMAIL_EXISTS]: 'Email already in use. Please try logging in or use a different email.',
        [AuthErrorCodes.WEAK_PASSWORD]: 'Password is too weak. Please use a stronger password.',
        [AuthErrorCodes.INVALID_EMAIL]: 'Invalid email address. Please check and try again.',
      });
    }
  };

  const logout = async (): Promise<void> => {
    setError(null);
    try {
      await signOut(auth);
    } catch (err) {
      return handleAuthError(err, {}, 'An unknown error occurred during logout');
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
