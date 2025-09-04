'use server';

import { z } from 'zod';

// Schema de validação para os parâmetros de busca
const searchProductsSchema = z.object({
  q: z.string().optional(),
  category: z.number().optional(),
  min_price: z.number().optional(),
  max_price: z.number().optional(),
  sort: z.string().optional(),
});

export type SearchProductsParams = z.infer<typeof searchProductsSchema>;

export async function searchProductsAction(params: SearchProductsParams) {
  try {
    // Validação dos parâmetros com Zod
    const validatedParams = searchProductsSchema.parse(params);
    
    const searchParams = new URLSearchParams();
    
    if (validatedParams.q) searchParams.append('q', validatedParams.q);
    if (validatedParams.category) searchParams.append('category', validatedParams.category.toString());
    if (validatedParams.min_price) searchParams.append('min_price', validatedParams.min_price.toString());
    if (validatedParams.max_price) searchParams.append('max_price', validatedParams.max_price.toString());
    if (validatedParams.sort) searchParams.append('sort', validatedParams.sort);
    
    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/products/search?${searchParams.toString()}`, {
      cache: 'no-store', 
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }
    
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Erro na busca de produtos:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido ao buscar produtos' 
    };
  }
}

export async function getAllProductsAction() {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/products`, {
      cache: 'force-cache',
      next: { revalidate: 300 },
    });
    
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }
    
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Erro ao buscar todos os produtos:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido ao buscar produtos' 
    };
  }
}

export async function getProductBySlugAction(slug: string) {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/products/${slug}`, {
      cache: 'force-cache',
      next: { revalidate: 600 }, // Revalida a cada 10 minutos
    });
    
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }
    
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido ao buscar produto' 
    };
  }
}