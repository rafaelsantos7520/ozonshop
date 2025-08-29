'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { logoutAction } from '@/app/actions/auth';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  is_admin: boolean;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ 
  children, 
  initialUser 
}: { 
  children: ReactNode;
  initialUser?: User | null;
}) {
  const [user, setUser] = useState<User | null>(initialUser || null);
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = !!user;

  useEffect(() => {
    const checkUserData = () => {
      const cookies = document.cookie.split(';');
      const userDataCookie = cookies.find(cookie => 
        cookie.trim().startsWith('user-data=')
      );
      
      if (userDataCookie) {
        try {
          const userData = decodeURIComponent(
            userDataCookie.split('=')[1]
          );
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (error) {
          console.error('Erro ao parsear dados do usuário:', error);
        }
      }
    };

    if (!initialUser) {
      checkUserData();
    }
  }, [initialUser]);

  const logout = async () => {
    setUser(null);
    await logoutAction();
  };

  const refreshUser = () => {
    const cookies = document.cookie.split(';');
    const userDataCookie = cookies.find(cookie => 
      cookie.trim().startsWith('user-data=')
    );
    
    if (userDataCookie) {
      try {
        const userData = decodeURIComponent(
          userDataCookie.split('=')[1]
        );
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Erro ao atualizar dados do usuário:', error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    logout,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

export type { AuthContextType };