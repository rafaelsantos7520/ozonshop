import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { CheckoutDataResponse } from '@/types/checkout';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

// GET /api/cart/checkout-data/get - Buscar dados para checkout
export async function GET() {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth-token')?.value;

    if (!authToken) {
      return NextResponse.json(
        { error: 'Token de autenticação não encontrado' },
        { status: 401 }
      );
    }

    // Fazer requisição para o backend Laravel
    const response = await fetch(`${BACKEND_URL}/api/v1/cart/checkout-data`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Erro do backend:', errorData);
      
      let errorMessage = 'Erro ao buscar dados do checkout';
      try {
        const parsedError = JSON.parse(errorData);
        errorMessage = parsedError.message || errorMessage;
      } catch {
        // Se não conseguir fazer parse, usa a mensagem padrão
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    const checkoutData: CheckoutDataResponse = await response.json();
    return NextResponse.json(checkoutData);

  } catch (error) {
    console.error('Erro na API Route dos dados do checkout:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}