import { api } from "@/lib/api";

// src/services/productService.ts
export async function getProductBySlug(slug: string) {
  const response = await api.get(`/api/v1/products/${slug}`);
  return response.data;
}

export async function getAllProducts() {
  const response = await api.get('/api/v1/products');
  return response.data;
}

export async function getProductsByCategory(categorySlug: string) {
  const response = await api.get(`/api/v1/products/category/${categorySlug}`);
  return response.data.data;
}

export async function searchProducts(search: string) {
  const response = await api.get(`/api/v1/products?search=${search}`);
  return response.data;
}
