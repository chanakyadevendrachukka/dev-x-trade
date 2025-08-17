import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signup: (email: string, password: string, displayName?: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  function signup(email: string, password: string, displayName?: string) {
    console.log('Attempting signup with:', { email, hasPassword: !!password, displayName });
    return createUserWithEmailAndPassword(auth, email, password).then(async (result) => {
      console.log('Signup successful:', result.user.uid);
      if (displayName && result.user) {
        await updateProfile(result.user, { displayName });
        console.log('Profile updated with displayName:', displayName);
      }
      return result;
    }).catch((error) => {
      console.error('Signup error:', error.code, error.message);
      throw error;
    });
  }

  function login(email: string, password: string) {
    console.log('Attempting login with:', email);
    return signInWithEmailAndPassword(auth, email, password).then((result) => {
      console.log('Login successful:', result.user.uid);
      return result;
    }).catch((error) => {
      console.error('Login error:', error.code, error.message);
      throw error;
    });
  }

  function logout() {
    console.log('Attempting logout');
    return signOut(auth).then(() => {
      console.log('Logout successful');
    }).catch((error) => {
      console.error('Logout error:', error.code, error.message);
      throw error;
    });
  }

  function loginWithGoogle() {
    console.log('Attempting Google login');
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider).then((result) => {
      console.log('Google login successful:', result.user.uid);
      return result;
    }).catch((error) => {
      console.error('Google login error:', error.code, error.message);
      throw error;
    });
  }

  useEffect(() => {
    console.log('Setting up auth state listener');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user ? `User: ${user.uid}` : 'No user');
      setCurrentUser(user);
      setLoading(false);
    }, (error) => {
      console.error('Auth state change error:', error);
      setLoading(false);
    });

    return () => {
      console.log('Cleaning up auth state listener');
      unsubscribe();
    };
  }, []);

  const value = {
    currentUser,
    loading,
    signup,
    login,
    logout,
    loginWithGoogle
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
