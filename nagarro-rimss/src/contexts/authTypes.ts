import type { User } from 'firebase/auth';

// Make sure this type is properly exported
export interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<User>;
  logout: () => Promise<void>;
  error: string | null;
}
