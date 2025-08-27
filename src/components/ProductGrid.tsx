'use client'
import { useQuery } from '@tanstack/react-query';
import { ProductCard } from './ProductCard';
import { IProduct } from '@/types/product';
import axios from 'axios';
import { getProductsByCategory } from '@/services/product/productService';

interface ProductGridProps {
  categorySlug: string;
}



export function ProductGrid({ categorySlug }: ProductGridProps) {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products', 'category', categorySlug],
    queryFn: () => getProductsByCategory(categorySlug),
    enabled: !!categorySlug
  });


  if (isLoading) {
    return (
      <div className="mt-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p>Carregando produtos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p>Erro ao carregar produtos: {error.message}</p>
        </div>
      </div>
    );
  }

  if (!products || !products.products || products.products.length === 0) {
    return (
      <div className="mt-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p>Nenhum produto encontrado nesta categoria</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          {/* {title} */}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products?.products?.map((product: IProduct) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}