import { useQuery, UseQueryOptions } from '@tanstack/react-query';

export type SearchProductsParams = {
  q?: string;
  category?: number;
  min_price?: number;
  max_price?: number;
  sort?: string;
};

type ProductsResponse = {
  items: any[];
  length: number;
  total?: number;
  page?: number;
  limit?: number;
};

type ProductResponse = {
  id: string;
  name: string;
  slug: string;
  price: number;
  description?: string;
  images?: string[];
  category?: any;
};

// Hook para buscar produtos com filtros
export function useSearchProducts(
  params: SearchProductsParams,
  options?: Omit<UseQueryOptions<ProductsResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ['products', 'search', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      
      if (params.q) searchParams.append('q', params.q);
      if (params.category) searchParams.append('category', params.category.toString());
      if (params.min_price) searchParams.append('min_price', params.min_price.toString());
      if (params.max_price) searchParams.append('max_price', params.max_price.toString());
      if (params.sort) searchParams.append('sort', params.sort);
      
      const response = await fetch(`/api/products/search?${searchParams.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao buscar produtos');
      }
      
      return response.json();
    },
    enabled: !!(params.q || params.category),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    ...options,
  });
}

// Hook para buscar todos os produtos
export function useAllProducts(
  options?: Omit<UseQueryOptions<ProductsResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ['products', 'all'],
    queryFn: async () => {
      const response = await fetch('/api/products');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao buscar produtos');
      }
      
      return response.json();
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
    ...options,
  });
}

// Hook para buscar produto por slug
export function useProductBySlug(
  slug: string,
  options?: Omit<UseQueryOptions<ProductResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ['products', 'bySlug', slug],
    queryFn: async () => {
      const response = await fetch(`/api/products/${slug}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao buscar produto');
      }
      
      return response.json();
    },
    enabled: !!slug,
    staleTime: 15 * 60 * 1000, // 15 minutos
    gcTime: 60 * 60 * 1000, // 1 hora
    ...options,
  });
}

// Hook para buscar produtos com parâmetros de URL
export function useProductsFromSearchParams(
  searchParams: URLSearchParams,
  options?: Omit<UseQueryOptions<ProductsResponse>, 'queryKey' | 'queryFn'>
) {
  const params: SearchProductsParams = {
    q: searchParams.get('search') || undefined,
    category: searchParams.get('category') ? parseInt(searchParams.get('category')!) : undefined,
    min_price: searchParams.get('min_price') ? parseFloat(searchParams.get('min_price')!) : undefined,
    max_price: searchParams.get('max_price') ? parseFloat(searchParams.get('max_price')!) : undefined,
    sort: searchParams.get('sort') || undefined,
  };

  return useSearchProducts(params, options);
}