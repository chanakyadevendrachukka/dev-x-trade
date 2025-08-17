import { useState, useEffect } from 'react';

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

// Mock user for testing
const mockUser: MockUser = {
  uid: 'mock-user-123',
  email: 'demo@devxtrade.com',
  displayName: 'Demo User',
  photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  metadata: {
    creationTime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    lastSignInTime: new Date().toISOString()
  }
};

export function useMockAuth() {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setUser(mockUser);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const signIn = async () => {
    setLoading(true);
    // Simulate sign in delay
    setTimeout(() => {
      setUser(mockUser);
      setLoading(false);
    }, 500);
  };

  const signOut = async () => {
    setLoading(true);
    setTimeout(() => {
      setUser(null);
      setLoading(false);
    }, 300);
  };

  return {
    user,
    loading,
    signIn,
    signOut
  };
}
