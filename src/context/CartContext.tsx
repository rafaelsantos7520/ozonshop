'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { IProduct } from '@/types/product';
import { useAuth } from '@/context/AuthContext';

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  product: IProduct;
  created_at: string;
  updated_at: string;
}

interface CartContextType {
  cart: CartItem[];
  isLoading: boolean;
  addToCart: (product: IProduct, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  total: number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const useCartQuery = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  return useQuery({
    queryKey: ['cart'],
    queryFn: async (): Promise<CartItem[]> => {
      if (!isAuthenticated) {
        return [];
      }
      
      const response = await fetch('/api/cart', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    },
    enabled: !authLoading && isAuthenticated,
    staleTime: 30 * 1000, 
    gcTime: 5 * 60 * 1000, 
  });
};

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const { data: cart = [], isLoading } = useCartQuery();

  const addToCartMutation = useMutation({
    mutationFn: async ({ product, quantity }: { product: IProduct; quantity: number }) => {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          product_id: product.id,
          quantity,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    },
    onMutate: async ({ product, quantity }) => {
      await queryClient.cancelQueries({ queryKey: ['cart'] });
      
      const previousCart = queryClient.getQueryData<CartItem[]>(['cart']) || [];
      
      const existingItem = previousCart.find(item => item.product.id === product.id);
      let optimisticCart: CartItem[];
      
      if (existingItem) {
        optimisticCart = previousCart.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const newItem: CartItem = {
          id: Date.now(),
          product_id: product.id,
          quantity,
          product,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        optimisticCart = [...previousCart, newItem];
      }
      
      queryClient.setQueryData(['cart'], optimisticCart);
      
      return { previousCart };
    },
    onError: (err, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(['cart'], context.previousCart);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (itemId: number) => {
      const item = cart.find(cartItem => cartItem.id === itemId);
      if (!item) throw new Error('Item não encontrado');
      
      const response = await fetch(`/api/cart/${item.product.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    },
    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: ['cart'] });
      
      const previousCart = queryClient.getQueryData<CartItem[]>(['cart']) || [];
      const optimisticCart = previousCart.filter(cartItem => cartItem.id !== itemId);
      
      queryClient.setQueryData(['cart'], optimisticCart);
      
      return { previousCart };
    },
    onError: (err, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(['cart'], context.previousCart);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: number; quantity: number }) => {
      const item = cart.find(cartItem => cartItem.id === itemId);
      if (!item) throw new Error('Item não encontrado');
      
      if (quantity <= 0) {
        return removeFromCartMutation.mutateAsync(itemId);
      }
      
      const response = await fetch(`/api/cart/${item.product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ quantity }),
      });
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    },
    onMutate: async ({ itemId, quantity }) => {
      if (quantity <= 0) {
        return removeFromCartMutation.mutate(itemId);
      }
      
      await queryClient.cancelQueries({ queryKey: ['cart'] });
      
      const previousCart = queryClient.getQueryData<CartItem[]>(['cart']) || [];
      const optimisticCart = previousCart.map(cartItem => 
        cartItem.id === itemId 
          ? { ...cartItem, quantity }
          : cartItem
      );
      
      queryClient.setQueryData(['cart'], optimisticCart);
      
      return { previousCart };
    },
    onError: (err, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(['cart'], context.previousCart);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  // Mutation para limpar carrinho
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['cart'] });
      
      const previousCart = queryClient.getQueryData<CartItem[]>(['cart']) || [];
      queryClient.setQueryData(['cart'], []);
      
      return { previousCart };
    },
    onError: (err, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(['cart'], context.previousCart);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const addToCart = async (product: IProduct, quantity: number) => {
    if (authLoading || !isAuthenticated) return;
    await addToCartMutation.mutateAsync({ product, quantity });
  };

  const removeFromCart = async (itemId: number) => {
    if (authLoading || !isAuthenticated) return;
    await removeFromCartMutation.mutateAsync(itemId);
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    if (authLoading || !isAuthenticated) return;
    await updateQuantityMutation.mutateAsync({ itemId, quantity });
  };

  const clearCart = async () => {
    if (authLoading || !isAuthenticated) return;
    await clearCartMutation.mutateAsync();
  };

  const refreshCart = async () => {
    await queryClient.invalidateQueries({ queryKey: ['cart'] });
  };

  const total = cart.reduce((sum: number, item: CartItem) => {
    const price = parseFloat(item.product.price) || 0;
    return sum + (price * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{
      cart,
      isLoading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      total,
      refreshCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
