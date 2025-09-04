import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { CheckoutData, CheckoutResponse } from '@/types/checkout';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

// POST /api/cart/checkout-data - Processar checkout
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth-token')?.value;

    if (!authToken) {
      return NextResponse.json(
        { error: 'Token de autenticação não encontrado' },
        { status: 401 }
      );
    }

    const body: CheckoutData = await request.json();

    // Validação básica dos dados obrigatórios
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone',
      'zipCode', 'street', 'number', 'neighborhood', 'city', 'state'
    ];

    for (const field of requiredFields) {
      if (!body[field as keyof CheckoutData]) {
        return NextResponse.json(
          { error: `Campo ${field} é obrigatório` },
          { status: 400 }
        );
      }
    }

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Carrinho está vazio' },
        { status: 400 }
      );
    }

    // Preparar dados para envio ao backend
    const checkoutPayload = {
      customer: {
        first_name: body.firstName,
        last_name: body.lastName,
        email: body.email,
        phone: body.phone
      },
      shipping_address: {
        zip_code: body.zipCode,
        street: body.street,
        number: body.number,
        complement: body.complement || '',
        neighborhood: body.neighborhood,
        city: body.city,
        state: body.state
      },
      items: body.items,
      subtotal: body.subtotal,
      shipping: body.shipping,
      total: body.total
    };

    // Fazer requisição para o backend Laravel
    const response = await fetch(`${BACKEND_URL}/api/v1/checkout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(checkoutPayload)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Erro do backend:', errorData);
      
      let errorMessage = 'Erro ao processar checkout';
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

    const checkoutResult: CheckoutResponse = await response.json();
    return NextResponse.json(checkoutResult);

  } catch (error) {
    console.error('Erro na API Route do checkout:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}