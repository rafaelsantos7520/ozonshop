'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { apiFetch } from '@/lib/apiFetch'

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
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    
    const validatedData = loginSchema.parse({ email, password })
    const response = await apiFetch.post<ApiLoginResponse>('/api/v1/auth/login', validatedData)

    
    if (!response.success) {
      return { success: false, error: response.message }
    }
    
    const cookieStore = await cookies()
    cookieStore.set('auth-token', response.data.access_token, {
      httpOnly: false, // Permitir acesso via JavaScript
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60, // 1 hour
      path: '/'
    })
    
    cookieStore.set('user-data', JSON.stringify(response.data.user), {
      httpOnly: false, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60,
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
    
    const response = await apiFetch.post('/auth/register', validatedData)

    console.log('Registro bem-sucedido', response)
    
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