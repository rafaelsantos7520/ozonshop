import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

// GET /api/cart - Buscar carrinho
export async function GET() {
  try {
    // Pega o token do cookie httpOnly
    const cookieStore = await cookies()
    const authToken = cookieStore.get('auth-token')?.value

    if (!authToken) {
      return NextResponse.json(
        { error: 'Token de autenticação não encontrado' },
        { status: 401 }
      )
    }

    // Faz a requisição para o backend Laravel
    const response = await fetch(`${BACKEND_URL}/api/v1/cart`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Erro do backend:', errorData)
      return NextResponse.json(
        { error: 'Erro ao buscar carrinho' },
        { status: response.status }
      )
    }

    const cartData = await response.json()
    return NextResponse.json(cartData)

  } catch (error) {
    console.error('Erro na API Route do carrinho:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/cart - Adicionar item ao carrinho
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const authToken = cookieStore.get('auth-token')?.value

    if (!authToken) {
      return NextResponse.json(
        { error: 'Token de autenticação não encontrado' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Faz a requisição para o backend Laravel
    const response = await fetch(`${BACKEND_URL}/api/v1/cart`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Erro do backend:', errorData)
      return NextResponse.json(
        { error: 'Erro ao adicionar item ao carrinho' },
        { status: response.status }
      )
    }

    const cartData = await response.json()
    return NextResponse.json(cartData)

  } catch (error) {
    console.error('Erro na API Route do carrinho:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/cart/[id] - Remover item do carrinho
export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const authToken = cookieStore.get('auth-token')?.value

    if (!authToken) {
      return NextResponse.json(
        { error: 'Token de autenticação não encontrado' },
        { status: 401 }
      )
    }

    // Pega o ID do item da URL
    const url = new URL(request.url)
    const itemId = url.searchParams.get('id')

    if (!itemId) {
      return NextResponse.json(
        { error: 'ID do item é obrigatório' },
        { status: 400 }
      )
    }

    // Faz a requisição para o backend Laravel
    const response = await fetch(`${BACKEND_URL}/api/v1/cart/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Erro do backend:', errorData)
      return NextResponse.json(
        { error: 'Erro ao remover item do carrinho' },
        { status: response.status }
      )
    }

    const cartData = await response.json()
    return NextResponse.json(cartData)

  } catch (error) {
    console.error('Erro na API Route do carrinho:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}