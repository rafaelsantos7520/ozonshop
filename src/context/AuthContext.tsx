'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { logoutAction, getUserAction, getUserFromCookieAction } from '@/app/actions/auth';
import { useQuery, useQueryClient } from '@tanstack/react-query';

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
  refreshUser: () => Promise<void>;
  refetchUser: () => Promise<void>;
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
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  const isAuthenticated = !!user;

  const fetchUserFromAPI = async (): Promise<User | null> => {
    try {
      const userData = await getUserAction();
      
      if (!userData) {
        setUser(null);
        return null;
      }

      return userData;
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      return null;
    }
  };

  const { data: apiUser, refetch: refetchUserQuery } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUserFromAPI,
    enabled: false, 
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    const checkUserData = () => {
      const cookies = document.cookie.split(';');
      const userDataCookie = cookies.find(cookie => 
        cookie.trim().startsWith('user-data=')
      );
      const authTokenCookie = cookies.find(cookie => 
        cookie.trim().startsWith('auth-token=')
      );
      
      if (userDataCookie && authTokenCookie) {
        try {
          const userData = decodeURIComponent(
            userDataCookie.split('=')[1]
          );
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (error) {
          console.error('Erro ao parsear dados do usuário:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    if (!initialUser) {
      checkUserData();
    } else {
      setIsLoading(false);
    }
  }, [initialUser]);

  useEffect(() => {
    if (apiUser) {
      setUser(apiUser);
    }
  }, [apiUser]);

  const logout = async () => {
    setUser(null);
    queryClient.clear(); 
    await logoutAction();
  };

  const refreshUser = async () => {
    try {
      const userData = await getUserFromCookieAction();
      setUser(userData);
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
      setUser(null);
    }
  };

  // Função para buscar dados atualizados do backend
  const refetchUser = async () => {
    try {
      const result = await refetchUserQuery();
      if (result.data) {
        setUser(result.data);
      }
    } catch (error) {
      console.error('Erro ao recarregar dados do usuário:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    logout,
    refreshUser,
    refetchUser
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