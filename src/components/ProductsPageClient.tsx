'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductGrid } from '@/components/ProductGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ICategory, IProduct } from '@/types/product';

type ProductsResponse = {
  data?: {
    items: IProduct[];
    pagination?: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
      from: number;
      to: number;
      next_page_url: string | null;
      prev_page_url: string | null;
    };
  };
  products?: IProduct[];
  items?: IProduct[];
  error?: string;
};

type SearchParams = {
  search?: string;
  category?: string;
  min_price?: string;
  max_price?: string;
  sort?: string;
};

type ProductsPageClientProps = {
  initialProducts: ProductsResponse;
  searchParams: SearchParams;
  categories: ICategory[];
};

export function ProductsPageClient({ initialProducts, searchParams, categories }: ProductsPageClientProps) {
  const router = useRouter();
  const currentSearchParams = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.search || '');
  const [category, setCategory] = useState(searchParams.category || 'all');
  const [minPrice, setMinPrice] = useState(searchParams.min_price || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.max_price || '');
  const [sort, setSort] = useState(searchParams.sort || 'relevance');
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = !!(searchParams.search || searchParams.category || searchParams.min_price || searchParams.max_price || searchParams.sort);
  
  const products = initialProducts.data?.items || initialProducts.products || initialProducts.items || [];
  const pagination = initialProducts.data?.pagination;

  const handleSearch = (page?: number) => {
    const params = new URLSearchParams();
    
    if (searchTerm.trim()) params.set('search', searchTerm.trim());
    if (category && category !== 'all') params.set('category', category);
    if (minPrice) params.set('min_price', minPrice);
    if (maxPrice) params.set('max_price', maxPrice);
    if (sort && sort !== 'relevance') params.set('sort', sort);
    if (page && page > 1) params.set('page', page.toString());
    
    const queryString = params.toString();
    router.push(`/product${queryString ? `?${queryString}` : ''}`);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategory('all');
    setMinPrice('');
    setMaxPrice('');
    setSort('relevance');
    router.push('/product');
  };

  const removeFilter = (filterType: string) => {
    const params = new URLSearchParams(currentSearchParams.toString());
    params.delete(filterType);
    
    switch (filterType) {
      case 'search':
        setSearchTerm('');
        break;
      case 'category':
        setCategory('all');
        break;
      case 'min_price':
        setMinPrice('');
        break;
      case 'max_price':
        setMaxPrice('');
        break;
      case 'sort':
        setSort('relevance');
        break;
    }
    
    const queryString = params.toString();
    router.push(`/product${queryString ? `?${queryString}` : ''}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const goToPage = (page: number) => {
    handleSearch(page);
  };

  const goToPreviousPage = () => {
    if (pagination && pagination.current_page > 1) {
      handleSearch(pagination.current_page - 1);
    }
  };

  const goToNextPage = () => {
    if (pagination && pagination.current_page < pagination.last_page) {
      handleSearch(pagination.current_page + 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Barra de busca */}
      <div className="mb-6">
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10"
            />
          </div>
          <Button onClick={() => handleSearch()} className="px-6">
            Buscar
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="px-4"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>

        {/* Filtros expandidos */}
        {showFilters && (
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria
                  </label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preço mínimo
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preço máximo
                  </label>
                  <Input
                    type="number"
                    placeholder="1000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ordenar por
                  </label>
                  <Select value={sort} onValueChange={setSort}>
                    <SelectTrigger>
                      <SelectValue placeholder="Relevância" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevância</SelectItem>
                      <SelectItem value="price_asc">Menor preço</SelectItem>
                      <SelectItem value="price_desc">Maior preço</SelectItem>
                      <SelectItem value="name_asc">Nome A-Z</SelectItem>
                      <SelectItem value="name_desc">Nome Z-A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button onClick={() => handleSearch()} className="flex-1">
                  Aplicar Filtros
                </Button>
                <Button variant="outline" onClick={clearFilters}>
                  Limpar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filtros ativos */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-4">
            {searchParams.search && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Busca: {searchParams.search}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeFilter('search')}
                />
              </Badge>
            )}
            {searchParams.category && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Categoria: {searchParams.category}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeFilter('category')}
                />
              </Badge>
            )}
            {searchParams.min_price && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Min: R$ {searchParams.min_price}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeFilter('min_price')}
                />
              </Badge>
            )}
            {searchParams.max_price && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Max: R$ {searchParams.max_price}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeFilter('max_price')}
                />
              </Badge>
            )}
            {searchParams.sort && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Ordem: {searchParams.sort}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeFilter('sort')}
                />
              </Badge>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="text-red-600 hover:text-red-700"
            >
              Limpar todos
            </Button>
          </div>
        )}
      </div>

      {/* Cabeçalho dos resultados */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {hasActiveFilters ? 'Resultados da pesquisa' : 'Todos os Produtos'}
        </h1>
        <p className="text-sm text-gray-500">
          {pagination ? `Exibindo ${pagination.from}-${pagination.to} de ${pagination.total}` : `${products.length}`} produto(s) {hasActiveFilters ? 'encontrado(s)' : 'disponível(is)'}
        </p>
      </div>

      {/* Grid de produtos */}
      <ProductGrid products={products} />
      
      {/* Paginação */}
      {pagination && pagination.last_page > 1 && (
        <div className="mt-8 flex items-center justify-center space-x-2">
          <Button
             variant="outline"
             size="sm"
             onClick={goToPreviousPage}
             disabled={pagination.current_page === 1}
             className="flex items-center gap-1"
           >
             <ChevronLeft className="h-4 w-4" />
             Anterior
           </Button>
          
          <div className="flex items-center space-x-1">
            {/* Primeira página */}
            {pagination.current_page > 3 && (
              <>
                <Button
                   variant={1 === pagination.current_page ? "default" : "outline"}
                   size="sm"
                   onClick={() => goToPage(1)}
                 >
                   1
                 </Button>
                {pagination.current_page > 4 && (
                  <span className="px-2 text-gray-500">...</span>
                )}
              </>
            )}
            
            {/* Páginas ao redor da atual */}
            {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
              const startPage = Math.max(1, Math.min(pagination.current_page - 2, pagination.last_page - 4));
              const pageNumber = startPage + i;
              
              if (pageNumber > pagination.last_page) return null;
              
              return (
                <Button
                   key={pageNumber}
                   variant={pageNumber === pagination.current_page ? "default" : "outline"}
                   size="sm"
                   onClick={() => goToPage(pageNumber)}
                 >
                   {pageNumber}
                 </Button>
              );
            })}
            
            {/* Última página */}
            {pagination.current_page < pagination.last_page - 2 && (
              <>
                {pagination.current_page < pagination.last_page - 3 && (
                  <span className="px-2 text-gray-500">...</span>
                )}
                <Button
                   variant={pagination.last_page === pagination.current_page ? "default" : "outline"}
                   size="sm"
                   onClick={() => goToPage(pagination.last_page)}
                 >
                   {pagination.last_page}
                 </Button>
              </>
            )}
          </div>
          
          <Button
             variant="outline"
             size="sm"
             onClick={goToNextPage}
             disabled={pagination.current_page === pagination.last_page}
             className="flex items-center gap-1"
           >
             Próxima
             <ChevronRight className="h-4 w-4" />
           </Button>
        </div>
      )}
    </div>
  );
}