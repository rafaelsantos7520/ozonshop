import React from 'react';
import { getProductById, getOtherProducts } from '@/data/products';
import ProductLanding from '@/components/ProductLanding';
import { ProductGrid } from '@/components/ProductGrid';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { getProductBySlug, getProductsByCategory } from '@/services/product/productService';
import axios from 'axios';
import { ProductCarousel } from '@/components/ProductCarousel';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const productSlug = resolvedParams.slug;
  const productResponse = await getProductBySlug(productSlug);  
  const product = productResponse.data;
  const relatioendProducts = await getProductsByCategory(product.category.slug);





  // const otherProducts = getOtherProducts(product.data.data.category);

  return (
    <div className="min-h-screen">
      <ProductLanding product={product} />
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ProductCarousel title="Produtos Relacionados" products={relatioendProducts.products} />
          {/* <ProductGrid products={relatioendProducts} /> */}
        </div>
      </div>
    </div>
  );
}
