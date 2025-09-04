'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'

// Interface do usuário
interface User {
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

// Schema de validação para login
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória')
})

// Schema de validação para registro
const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  password_confirmation: z.string().min(6, 'Confirmação de senha deve ter pelo menos 6 caracteres')
}).refine((data) => data.password === data.password_confirmation, {
  message: "As senhas não coincidem",
  path: ["password_confirmation"],
})

// Interface para resposta da API de login
interface ApiLoginResponse {
  success: boolean
  message: string
  data: {
    user: {
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
    access_token: string
    token_type: string
  }
  timestamp: string
  status_code: number
}

// Interface para resposta das actions
interface LoginResponse {
  success: boolean
  error?: string
}

interface RegisterResponse {
  success: boolean
  error?: string
}

export async function loginAction(formData: FormData): Promise<LoginResponse> {
  try {
    const BACKEND_URL = process.env.BACKEND_URL
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    
    const validatedData = loginSchema.parse({ email, password })
    const response = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedData),
    })


    
    const responseData = await response.json()
    
    if (!response.ok) {
      return { success: false, error: responseData.message }
    }
    
    const cookieStore = await cookies()
    
    cookieStore.set('auth-token', responseData.data.access_token, { 
      httpOnly: false, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 2, // 2 hours
      path: '/'
    })
    
    cookieStore.set('user-data', JSON.stringify(responseData.data.user), {
      httpOnly: false, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 2, // 2 hours
      path: '/'
    })
    
    return { success: true }
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    
    console.log('Erro na requisição:', error)
    return { success: false, error: 'Erro interno do servidor' }
  }
}

export async function registerAction(formData: FormData): Promise<RegisterResponse> {
  try {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const password_confirmation = formData.get('password_confirmation') as string
    
    const validatedData = registerSchema.parse({ name, email, password, password_confirmation })
    const BACKEND_URL = process.env.BACKEND_URL
    
    const response = await fetch(`${BACKEND_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedData),
    })
    
    return { success: true }
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    
    return { success: false, error: 'Erro interno do servidor' }
  }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  
  cookieStore.delete('auth-token')
  cookieStore.delete('user-data')
  
  redirect('/login')
}

export async function redirectToHome() {
  redirect('/')
}

/**
 * Server Action para buscar dados atualizados do usuário
 * @returns User | null
 */
export async function getUserAction(): Promise<User | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value
  
  if (!token) {
    return null
  }
  
  try {
    const BACKEND_URL = process.env.BACKEND_URL
    const response = await fetch(`${BACKEND_URL}/api/v1/auth/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      cookieStore.delete('auth-token')
      cookieStore.delete('user-data')
      return null
    }
    
    const responseData = await response.json()
    
    if (!responseData.success) {
      cookieStore.delete('auth-token')
      cookieStore.delete('user-data')
      return null
    }
    
    cookieStore.set('user-data', JSON.stringify(responseData.data), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 2, 
      path: '/'
    })
    
    return responseData.data
    
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error)
    cookieStore.delete('auth-token')
    cookieStore.delete('user-data')
    return null
  }
}

/**
 * Server Action para verificar se o usuário está autenticado
 * @returns boolean
 */
export async function isAuthenticatedAction(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value
  return !!token
}

/**
 * Server Action para obter dados do usuário do cookie (fallback rápido)
 * @returns User | null
 */
export async function getUserFromCookieAction(): Promise<User | null> {
  const cookieStore = await cookies()
  const userDataCookie = cookieStore.get('user-data')?.value
  const token = cookieStore.get('auth-token')?.value
  
  if (!token) {
    return null
  }
  
  if (!userDataCookie) {
    return null
  }
  
  try {
    return JSON.parse(userDataCookie)
  } catch (error) {
    console.error('Erro ao parsear dados do usuário do cookie:', error)
    return null
  }
}