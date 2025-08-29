'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { IProduct } from '@/types/product';
import { apiFetch } from '@/lib/apiFetch';
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
  total: number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCart = async () => {
    console.log('🛒 CartContext: Iniciando fetchCart')
    if (!isAuthenticated) {
      console.log('🛒 CartContext: Usuário não autenticado, não buscando carrinho')
      setCart([]);
      return
    }

    try {
      setIsLoading(true)
      console.log('🛒 CartContext: Fazendo requisição para API Route /api/cart')
      // Agora chama a API Route do Next.js ao invés do backend direto
      const response = await fetch('/api/cart', {
        method: 'GET',
        credentials: 'include' // Inclui cookies automaticamente
      })
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }
      
      const cartData = await response.json()
      console.log('🛒 CartContext: Resposta recebida da API Route:', cartData)
      setCart(cartData)
    } catch (error) {
      console.error('🛒 CartContext: Erro ao buscar carrinho:', error)
      setCart([]);
    } finally {
      setIsLoading(false)
    }
  };

  const addToCart = async (product: IProduct, quantity: number) => {
    console.log('🛒 CartContext: Iniciando addToCart', { productId: product.id, quantity })
    
    if (!isAuthenticated) {
      throw new Error('Usuário não autenticado');
    }

    try {
      setIsLoading(true)
      console.log('🛒 CartContext: Fazendo requisição POST para API Route /api/cart')
      // Agora chama a API Route do Next.js ao invés do backend direto
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Inclui cookies automaticamente
        body: JSON.stringify({
          product_id: product.id,
          quantity
        })
      })
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }
      
      const cartData = await response.json()
      console.log('🛒 CartContext: Resposta do addToCart da API Route:', cartData)
      await fetchCart(); // Recarrega o carrinho
    } catch (error) {
      console.error('🛒 CartContext: Erro ao adicionar ao carrinho:', error)
      throw error;
    } finally {
      setIsLoading(false)
    }
  };

  const removeFromCart = async (itemId: number) => {
    if (!isAuthenticated) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const response = await apiFetch.delete<{ success: boolean }>(`/api/v1/cart/${itemId}`);
      if (response.success) {
        await fetchCart(); // Recarrega o carrinho
      }
    } catch (error) {
      console.error('Erro ao remover do carrinho:', error);
      throw error;
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    if (!isAuthenticated) {
      throw new Error('Usuário não autenticado');
    }
    
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    try {
      const response = await apiFetch.put<{ success: boolean }>(`/api/v1/cart/${itemId}`, {
        quantity
      });
      
      if (response.success) {
        await fetchCart(); // Recarrega o carrinho
      }
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
      throw error;
    }
  };

  const total = cart.reduce((sum, item) => {
    const price = parseFloat(item.product.price) || 0;
    return sum + (price * item.quantity);
  }, 0);

  // Carrega o carrinho quando o usuário está autenticado
  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  return (
    <CartContext.Provider value={{
      cart,
      isLoading,
      addToCart,
      removeFromCart,
      updateQuantity,
      total,
      refreshCart: fetchCart,
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
