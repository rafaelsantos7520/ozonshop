import { apiFetch } from "@/lib/apiFetch";

export async function getCategoryById(id: string, revalidate?: number) {
  const response = await apiFetch.get<any>(`/api/v1/categories/${id}`, revalidate);
  return response.data;
}

export async function getAllCategories(revalidate?: number) {
  const response = await apiFetch.get<any>('/api/v1/categories', revalidate);
  return response.data
}

export async function getSubcategoriesByCategory(categorySlug: string, revalidate?: number) {
  const response = await apiFetch.get<any>(`/api/v1/categories/${categorySlug}/subcategories`, revalidate);
  return response.data.data;
}

export async function getCategoriesWithProducts(revalidate?: number) {
  const response = await apiFetch.get<any>('/api/v1/categories/with-products', revalidate);
  return response.data;
}


