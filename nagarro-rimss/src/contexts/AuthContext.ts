import { createContext } from 'react';
import type { User } from 'firebase/auth';

// Define the AuthContextType
export interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<User>;
  loginWithEmail: (email: string, password: string) => Promise<User>;
  registerWithEmail: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  error: string | null;
  isPopupBlocked?: boolean;
}

// Create the context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
