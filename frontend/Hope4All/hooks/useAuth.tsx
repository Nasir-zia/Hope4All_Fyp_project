import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

interface User {
  id: string;
  token: string;
  role: string;
  username?: string;
  email?: string;
  status?: string;
  suspensionReason?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, userData: Partial<User>) => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
}

// Storage Helper for Web Support
const storage = {
  getItem: async (key: string) => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string) => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },
  deleteItem: async (key: string) => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = await storage.getItem('token');
      const userData = await storage.getItem('user');

      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        // Ensure token is stored in user object for downstream usage
        setUser({ ...parsedUser, token });
      } else if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (token: string, userData: Partial<User> & { _id?: string }) => {
    const fullUser = {
      id: userData.id || userData._id || '',
      token,
      role: userData.role || 'orphan',
      ...userData,
    };

    setUser(fullUser);
    await storage.setItem('token', token);
    await storage.setItem('user', JSON.stringify(fullUser));
  };

  const updateUser = async (data: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    await storage.setItem('user', JSON.stringify(updatedUser));
  };

  const logout = async () => {
    console.log('[Auth] Logging out...');
    // Set user to null immediately for instant UI response
    setUser(null);
    
    try {
      await storage.deleteItem('token');
      await storage.deleteItem('user');
      console.log('[Auth] Storage cleared');
    } catch (err) {
      console.error('[Auth] Error clearing storage:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};