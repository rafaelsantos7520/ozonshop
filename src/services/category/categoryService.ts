
export async function getCategoryById(id: string, revalidate?: number) {
  const response = await fetch(`${process.env.BACKEND_URL}/api/v1/categories/${id}`, {
    next: { revalidate }
  });
  return response.json();
}

export async function getAllCategories(revalidate ?: number) {
  const response = await fetch(`${process.env.BACKEND_URL}/api/v1/categories`, {
    next: { revalidate }
  });
  return response.json();
}

export async function getSubcategoriesByCategory(categorySlug: string, revalidate?: number) {
  const response = await fetch(`${process.env.BACKEND_URL}/api/v1/categories/${categorySlug}/subcategories`, {
    next: { revalidate }
  });
  return response.json();
}

export async function getCategoriesWithProducts(revalidate?: number) {
  const response = await fetch(`${process.env.BACKEND_URL}/api/v1/categories/with-products`, {
    next: { revalidate }
  });
  return response.json();
}


