import React from 'react';
import ProductLanding from '@/components/ProductLanding';
import { getProductBySlug, getProductsByCategory } from '@/services/product/productService';
import { ProductCarousel } from '@/components/ProductCarousel';

interface ProductPageProps {
  params: Promise<{ 
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const productSlug = resolvedParams.slug;
  const productResponse = await getProductBySlug(productSlug, 3600); 
  const relatedProducts = await getProductsByCategory(productResponse.category.slug, 3600);

  return (
    <div className="min-h-screen">
      <ProductLanding product={productResponse} />
      <div className="py-16 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ProductCarousel title="Produtos Relacionados" products={relatedProducts.products} />
        </div>
      </div>
    </div>
  );
}
