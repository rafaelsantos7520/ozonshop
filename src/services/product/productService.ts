import { apiFetch } from "@/lib/apiFetch";

// Service genérico - recebe cache como parâmetro opcional
export async function getProductBySlug(slug: string, revalidate?: number) {
  const response = await apiFetch.get<any>(`/products/${slug}`, revalidate);
  return response.data;
}

export async function getAllProducts(revalidate?: number) {
  const response = await apiFetch.get<any>('/products', revalidate);
  return response.data;
}

export async function getProductsByCategory(categorySlug: string, revalidate?: number) {
  const response = await apiFetch.get<any>(`/api/v1/products/category/${categorySlug}`, revalidate);
  return response.data;
}

export async function searchProducts(q: string, category?: number, min_price?: number, max_price?: number, sort?: string) {
  const params = new URLSearchParams();
  
  if (q) params.append('q', q);
  if (category) params.append('category', category.toString());
  if (min_price) params.append('min_price', min_price.toString());
  if (max_price) params.append('max_price', max_price.toString());
  if (sort) params.append('sort', sort);
  
  // Busca nunca é cacheada (sempre fresh)
  const response = await apiFetch.get<any>(`/api/v1/products/search?${params.toString()}`);
  return response.data;
}
