'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

interface CartItem {
  product_id: number
  quantity: number
  variant_id?: number
}

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// Helper para fazer requisições autenticadas ao backend
async function authenticatedFetch(endpoint: string, options: RequestInit = {}) {
  const cookieStore = await cookies()
  const authToken = cookieStore.get('auth-token')?.value

  if (!authToken) {
    throw new Error('Token de autenticação não encontrado')
  }

  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers
    }
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error(`Erro na requisição ${endpoint}:`, errorText)
    throw new Error(`Erro ${response.status}: ${response.statusText}`)
  }

  return response.json()
}

// Server Action para buscar carrinho
export async function getCartAction(): Promise<ApiResponse<any>> {
  try {
    const cartData = await authenticatedFetch('/api/v1/cart')
    return {
      success: true,
      data: cartData
    }
  } catch (error) {
    console.error('Erro ao buscar carrinho:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }
  }
}

// Server Action para adicionar item ao carrinho
export async function addToCartAction(item: CartItem): Promise<ApiResponse<any>> {
  try {
    const cartData = await authenticatedFetch('/api/v1/cart', {
      method: 'POST',
      body: JSON.stringify(item)
    })

    // Revalida a página do carrinho para atualizar os dados
    revalidatePath('/cart')
    
    return {
      success: true,
      data: cartData
    }
  } catch (error) {
    console.error('Erro ao adicionar item ao carrinho:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }
  }
}

// Server Action para remover item do carrinho
export async function removeFromCartAction(itemId: number): Promise<ApiResponse<any>> {
  try {
    const cartData = await authenticatedFetch(`/api/v1/cart/${itemId}`, {
      method: 'DELETE'
    })

    // Revalida a página do carrinho para atualizar os dados
    revalidatePath('/cart')
    
    return {
      success: true,
      data: cartData
    }
  } catch (error) {
    console.error('Erro ao remover item do carrinho:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }
  }
}

// Server Action para atualizar quantidade de item
export async function updateCartItemAction(
  itemId: number, 
  quantity: number
): Promise<ApiResponse<any>> {
  try {
    const cartData = await authenticatedFetch(`/api/v1/cart/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity })
    })

    // Revalida a página do carrinho para atualizar os dados
    revalidatePath('/cart')
    
    return {
      success: true,
      data: cartData
    }
  } catch (error) {
    console.error('Erro ao atualizar item do carrinho:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }
  }
}

// Server Action para limpar carrinho
export async function clearCartAction(): Promise<ApiResponse<any>> {
  try {
    const cartData = await authenticatedFetch('/api/v1/cart', {
      method: 'DELETE'
    })

    // Revalida a página do carrinho para atualizar os dados
    revalidatePath('/cart')
    
    return {
      success: true,
      data: cartData
    }
  } catch (error) {
    console.error('Erro ao limpar carrinho:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }
  }
}