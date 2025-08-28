import { api } from "@/lib/api";

export async function getCategoryById(id: string) {
  const response = await api.get(`/api/v1/categories/${id}`);
  return response.data;
}

export async function getAllCategories() {
  const response = await api.get('/api/v1/categories');
  return response.data.data;
}

export async function getSubcategoriesByCategory(categorySlug: string) {
  const response = await api.get(`/api/v1/categories/${categorySlug}/subcategories`);
  return response.data.data;
}

export async function getCategoriesWithProducts() {
  const response = await api.get('/api/v1/categories/with-products');
  return response.data;
}


