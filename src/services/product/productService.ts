export async function getProductBySlug(slug: string, revalidate?: number) {
  try{
  const response = await fetch(`${process.env.BACKEND_URL}/products/${slug}`, {
    next: { revalidate }
  });
  return response.json();
  } catch (error) {

    return { error: 'Erro ao buscar produto' };
  }
}

export async function getAllProducts(page?: number, revalidate?: number) {
  try {
    const params = new URLSearchParams();

    if (page) params.append('page', page.toString());
    
    const url = `${process.env.BACKEND_URL}/api/v1/products${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url, {
      next: { revalidate }
    });
    return response.json();
  } catch (error) {
    console.log(error);
    return { error: 'Erro ao buscar produtos' };
  }
}

export async function getProductsByCategory(categorySlug: string, revalidate?: number) {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/products/category/${categorySlug}`, { 
      next: { revalidate }
    });
    return response.json();
  } catch (error) {
    console.log(error);
    return { error: 'Erro ao buscar produtos' };
  }
}

export async function searchProducts(q: string, category?: number, min_price?: number, max_price?: number, sort?: string, page?: number, revalidate?: number) {
  const params = new URLSearchParams();
  try {
    if (q) params.append('q', q);
    if (category) params.append('category', category.toString());
    if (min_price) params.append('min_price', min_price.toString());
    if (max_price) params.append('max_price', max_price.toString());
    if (sort) params.append('sort', sort);
    if (page) params.append('page', page.toString());
    
    // Backend docs: GET /search/results (no /api/v1/products prefix)
    const url = `${process.env.BACKEND_URL}/api/v1/search/results?${params.toString()}`;
    const response = await fetch(url, { next: { revalidate } });

    if (!response.ok) {
      const text = await response.text();
      return { error: `Busca falhou (${response.status}). ${text?.slice(0, 200)}` };
    }


    return await response.json();
  } catch (error) {
    console.log(error);
    return { error: 'Erro ao buscar produtos' };
  }
}
