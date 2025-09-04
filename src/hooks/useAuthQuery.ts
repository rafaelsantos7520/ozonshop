import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { User } from '@/context/AuthContext';
import { getUserAction } from '@/app/actions/auth';

export function useUserQuery() {
  const { user, isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: async (): Promise<User> => {
      const userData = await getUserAction();
      
      if (!userData) {
        throw new Error('Erro ao buscar dados do usuário');
      }

      return userData;
    },
    enabled: isAuthenticated, // Só executa se estiver autenticado
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: (failureCount, error: any) => {
      // Não tentar novamente se for erro 401 (não autorizado)
      if (error?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
    initialData: user || undefined,
  });
}

// Hook para atualizar dados do usuário
export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { refetchUser } = useAuth();
  
  return useMutation({
    mutationFn: async () => {
      const userData = await getUserAction();
      
      if (!userData) {
        throw new Error('Erro ao atualizar dados do usuário');
      }

      return userData;
    },
    onSuccess: (userData) => {
      // Atualizar cache do React Query
      queryClient.setQueryData(['user', 'profile'], userData);
      
      // Atualizar contexto de autenticação
      refetchUser();
    },
    onError: (error) => {
      console.error('Erro ao atualizar usuário:', error);
    },
  });
}

// Hook para verificar se o usuário está autenticado com dados atualizados
export function useAuthStatus() {
  const { isAuthenticated, isLoading } = useAuth();
  const { data: userData, isLoading: isUserLoading, error } = useUserQuery();
  
  return {
    isAuthenticated,
    isLoading: isLoading || isUserLoading,
    user: userData,
    error,
    hasValidSession: isAuthenticated && !!userData && !error,
  };
}

// Hook para invalidar dados do usuário (útil após atualizações)
export function useInvalidateUser() {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: ['user'] });
  };
}

// Hook para pré-carregar dados do usuário
export function usePrefetchUser() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  
  return () => {
    if (isAuthenticated) {
      queryClient.prefetchQuery({
        queryKey: ['user', 'profile'],
        queryFn: async (): Promise<User> => {
          const userData = await getUserAction();
          
          if (!userData) {
            throw new Error('Erro ao buscar dados do usuário');
          }

          return userData;
        },
        staleTime: 5 * 60 * 1000,
      });
    }
  };
}