import { cookies } from 'next/headers'

export interface User {
  id: string
  name: string
  email: string
  phone: string | null
  address: string | null
  is_admin: boolean
  email_verified_at: string | null
  created_at: string
  updated_at: string
}

/**
 * Verifica se o usuário está autenticado
 * @returns boolean
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value
  return !!token
}

/**
 * Obtém os dados do usuário autenticado
 * @returns User | null
 */
export async function getUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value
  
  if (!token) {
    return null
  }
  
  try {
    // Buscar dados atualizados do usuário no backend
    const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:8000'}/api/v1/auth/user`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    
    if (!response.ok) {
      // Se a resposta não foi bem-sucedida, limpar o token inválido
      cookieStore.delete('auth-token')
      cookieStore.delete('user-data')
      return null
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error)
    // Em caso de erro, limpar tokens potencialmente inválidos
    cookieStore.delete('auth-token')
    cookieStore.delete('user-data')
    return null
  }
}

/**
 * Obtém o token de autenticação
 * @returns string | null
 */
export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get('auth-token')?.value || null
}

/**
 * Verifica se o token é válido
 * @param token 
 * @returns boolean
 */
export async function validateToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:8000'}/api/v1/auth/validate`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    
    return response.ok
  } catch (error) {
    console.error('Erro ao validar token:', error)
    return false
  }
}