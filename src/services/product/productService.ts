import { api } from "@/lib/api";

export async function getProductBySlug(slug: string) {
  const response = await api.get(`/products/${slug}`);
  return response.data.data;
}

export async function getAllProducts() {
  const response = await api.get('/products');
  return response.data.data;
}

export async function getProductsByCategory(categorySlug: string) {
  const response = await api.get(`api/v1/products/category/${categorySlug}`);
  return response.data.data;
}

export async function searchProducts(q: string, category?: number, min_price?: number, max_price?: number, sort?: string) {
  const params = new URLSearchParams();
  
  if (q) params.append('q', q);
  if (category) params.append('category', category.toString());
  if (min_price) params.append('min_price', min_price.toString());
  if (max_price) params.append('max_price', max_price.toString());
  if (sort) params.append('sort', sort);
  
  const response = await api.get(`api/v1/products/search?${params.toString()}`);
  return response.data.data;
}
