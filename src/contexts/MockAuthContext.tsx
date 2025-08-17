import React, { createContext, useContext } from 'react';
import { useMockAuth } from '@/hooks/useMockAuth';

interface MockUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  metadata: {
    creationTime: string;
    lastSignInTime: string;
  };
}

interface MockAuthContextType {
  currentUser: MockUser | null;
  loading: boolean;
  signup: (email: string, password: string, displayName?: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<any>;
}

const MockAuthContext = createContext<MockAuthContextType>({} as MockAuthContextType);

export function useAuth() {
  return useContext(MockAuthContext);
}

export function MockAuthProvider({ children }: { children: React.ReactNode }) {
  const { user, loading, signIn, signOut } = useMockAuth();

  const mockFunctions = {
    signup: async (email: string, password: string, displayName?: string) => {
      console.log('Mock signup:', { email, displayName });
      return signIn();
    },
    login: async (email: string, password: string) => {
      console.log('Mock login:', email);
      return signIn();
    },
    logout: async () => {
      console.log('Mock logout');
      return signOut();
    },
    loginWithGoogle: async () => {
      console.log('Mock Google login');
      return signIn();
    }
  };

  const value = {
    currentUser: user,
    loading,
    ...mockFunctions
  };

  return (
    <MockAuthContext.Provider value={value}>
      {children}
    </MockAuthContext.Provider>
  );
}
