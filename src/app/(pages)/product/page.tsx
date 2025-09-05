
import React, { Suspense } from 'react';
import { getAllProducts, searchProducts } from '@/services/product/productService';
import { ProductsPageClient } from '@/components/ProductsPageClient';
import { Loader2 } from 'lucide-react';
import { getAllCategories } from '@/services/category/categoryService';

type SearchParams = {
  search?: string;
  category?: string;
  min_price?: string;
  max_price?: string;
  sort?: string;
  page?: string;
};

type ProductPageProps = {
  searchParams: Promise<SearchParams>;
};

async function getProducts(searchParams: SearchParams) {
  const { search, category, min_price, max_price, sort, page } = searchParams;
  
  const hasFilters = !!(search || category || min_price || max_price || sort);
  const pageNumber = page ? parseInt(page) : undefined;
  
  if (hasFilters) {
    return await searchProducts(
      search || '',
      category ? parseInt(category) : undefined,
      min_price ? parseFloat(min_price) : undefined,
      max_price ? parseFloat(max_price) : undefined,
      sort || undefined,
      pageNumber
    );
  } else {
    return await getAllProducts(pageNumber);
  }
}

export default async function ProductPage({ searchParams }: ProductPageProps) {
  const resolvedSearchParams = await searchParams;
  const products = await getProducts(resolvedSearchParams);
  const categories = await getAllCategories();
  
  if (products.error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Erro ao carregar produtos
          </h3>
          <p className="text-gray-600">
            {products.error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600">Carregando produtos...</p>
        </div>
      </div>
    }>
      <ProductsPageClient 
        categories={categories?.data || []}
        initialProducts={products.data} 
        searchParams={resolvedSearchParams}
      />
    </Suspense>
  );
}