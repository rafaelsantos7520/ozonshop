
'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Search, Loader2 } from 'lucide-react';
import { ProductGrid } from '@/components/ProductGrid';
import { searchProducts } from '@/services/product/productService';

function ProductPageContent() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('search');
  const category = searchParams.get('category');
  const minPrice = searchParams.get('min_price');
  const maxPrice = searchParams.get('max_price');
  const sort = searchParams.get('sort');

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products', searchTerm, category, minPrice, maxPrice, sort],
    queryFn: () => searchProducts(
      searchTerm || '',
      category ? parseInt(category) : undefined,
      minPrice ? parseFloat(minPrice) : undefined,
      maxPrice ? parseFloat(maxPrice) : undefined,
      sort || undefined
    ),
    enabled: !!searchTerm,
    staleTime: 5 * 60 * 1000, 
  });

  

  if (!searchTerm) {
    return (
      <div className="container mx-auto px-2 py-8">
        <div className="text-center py-12">
          <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Página de Produtos
          </h1>
          <p className="text-gray-600">
            Use a barra de pesquisa no topo para buscar produtos.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600">Buscando produtos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <Search className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Erro ao buscar produtos
          </h3>
          <p className="text-gray-600">
            Ocorreu um erro ao buscar os produtos. Tente novamente.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Resultados da pesquisa
        </h1>
        <p className="text-gray-600">
          Você pesquisou por: <span className="font-semibold">"{searchTerm}"</span>
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {products.length} produto(s) encontrado(s)
        </p>
      </div>
      <ProductGrid products={products.items} />
    </div>
  );
}

export default function Product() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Carregando...</div>}>
      <ProductPageContent />
    </Suspense>
  );
}