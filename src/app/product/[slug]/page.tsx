import React from 'react';
import ProductLanding from '@/components/ProductLanding';
import { getProductBySlug, getProductsByCategory } from '@/services/product/productService';
import { ProductCarousel } from '@/components/ProductCarousel';
import { ApiErrorFallback } from '@/components/ErrorFallback';

interface ProductPageProps {
  params: Promise<{ 
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const productSlug = resolvedParams.slug;
  const productResponse = await getProductBySlug(productSlug, 3600); 
  if (productResponse.error) {
    return (
      <ApiErrorFallback 
        title="Produto indisponível"
        message="Não foi possível carregar as informações do produto. Nossos serviços estão temporariamente indisponíveis."
      />
    );
  }

  let relatedProducts = null;
  if (productResponse.data.category) {
    const relatedProductsResponse = await getProductsByCategory(productResponse.data.category.slug, 3600);
    if (relatedProductsResponse.error) {
      return (
        <div className="min-h-screen">
          <ProductLanding product={productResponse.data} />
          <div className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <ApiErrorFallback 
                title="Produtos relacionados indisponíveis"
                message="Não foi possível carregar os produtos relacionados."
                showHomeButton={false}
              />
            </div>
          </div>
        </div>
      );
    }
    relatedProducts = relatedProductsResponse;
  }


  return (
    <div className="min-h-screen">
      <ProductLanding product={productResponse.data} />
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border">
            {relatedProducts && (
              <ProductCarousel title="Produtos Relacionados" products={relatedProducts.data.products} />
            )}
        </div>
      </div>
    </div>
  );
}
