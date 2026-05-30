import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

interface User {
  email: string;
  displayName: string;
  totalPoints: number;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  updatePoints: (points: number) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { loadUser(); }, []);

  const loadUser = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      const userData = await SecureStore.getItemAsync('user');
      if (token && userData) setUser(JSON.parse(userData));
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData: User) => {
    await SecureStore.setItemAsync('token', userData.token);
    await SecureStore.setItemAsync('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('user');
    setUser(null);
  };

  const updatePoints = (points: number) => {
    if (!user) return;
    const updated = { ...user, totalPoints: points };
    setUser(updated);
    SecureStore.setItemAsync('user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, updatePoints }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};