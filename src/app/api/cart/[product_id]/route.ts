import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

// PATCH /api/cart/{product_id} - Atualizar quantidade de produto no carrinho
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ product_id: string }> }
) {
  try {
    const cookieStore = await cookies()
    const authToken = cookieStore.get('auth-token')?.value

    if (!authToken) {
      return NextResponse.json(
        { error: 'Token de autenticação não encontrado' },
        { status: 401 }
      )
    }

    const { product_id } = await params

    if (!product_id) {
      return NextResponse.json(
        { error: 'product_id é obrigatório' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { quantity } = body

    if (quantity === undefined || quantity < 0) {
      return NextResponse.json(
        { error: 'Quantidade deve ser um número válido' },
        { status: 400 }
      )
    }

    const response = await fetch(`${BACKEND_URL}/api/v1/cart/${product_id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ quantity })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Erro do backend:', errorData)
      return NextResponse.json(
        { error: 'Erro ao atualizar quantidade do item' },
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

// DELETE /api/cart/{product_id} - Remover produto do carrinho
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ product_id: string }> }
) {
  try {
    const cookieStore = await cookies()
    const authToken = cookieStore.get('auth-token')?.value

    if (!authToken) {
      return NextResponse.json(
        { error: 'Token de autenticação não encontrado' },
        { status: 401 }
      )
    }

    const { product_id } = await params

    if (!product_id) {
      return NextResponse.json(
        { error: 'product_id é obrigatório' },
        { status: 400 }
      )
    }

    // Faz a requisição para o backend Laravel
    const response = await fetch(`${BACKEND_URL}/api/v1/cart/${product_id}`, {
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
        { error: 'Erro ao remover produto do carrinho' },
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