'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductGrid } from '@/components/ProductGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ICategory, IProduct } from '@/types/product';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from './ui/pagination';
import { Label } from './ui/label';

type ProductsResponse = {
  data?: {
    items: IProduct[];
  };
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
  const filtersWrapperRef = useRef<HTMLDivElement>(null);
  
  const [searchTerm, setSearchTerm] = useState(searchParams.search || '');
  const [category, setCategory] = useState(searchParams.category || 'all');
  const [minPrice, setMinPrice] = useState(searchParams.min_price || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.max_price || '');
  const [sort, setSort] = useState(searchParams.sort || 'relevance');
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = !!(searchParams.search || searchParams.category || searchParams.min_price || searchParams.max_price || searchParams.sort);
  
  const products = initialProducts.data?.items || initialProducts.products || initialProducts.items || [];
  const pagination = initialProducts.pagination;


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

  console.log(pagination);

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

  // Compute which pages to show: always first & last, plus up to 3 middle pages near current
  const middleRange = React.useMemo(() => {
    if (!pagination) return { start: 0, end: 0 };
    const { current_page, last_page } = pagination;
    if (last_page <= 5) return { start: 2, end: last_page - 1 };
    let start = Math.max(2, current_page - 1);
    let end = Math.min(last_page - 1, current_page + 1);
    // ensure we have up to 3 pages in the middle
    while (end - start + 1 < 3 && start > 2) start--;
    while (end - start + 1 < 3 && end < last_page - 1) end++;
    return { start, end };
  }, [pagination]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Barra de busca */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 mb-4 items-center">
          {/* Campo de busca */}
          <div className="md:col-span-8 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyUp={handleKeyPress}
              className="pl-10 h-10 w-full"
            />
          </div>


            
          {/* Ações: Buscar + Filtros */}
          <div className="md:col-span-4 flex flex-col md:flex-row  md:justify-end gap-2">
            <Button onClick={() => handleSearch()} className="h-10 px-5 w-full md:w-auto">
              Buscar
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="h-10 px-4 w-full md:w-auto"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>

        {/* Filtros expandidos com animação suave */}
        <div
          className={`mb-4 transition-all duration-500 ease-in-out overflow-hidden ${showFilters ? 'opacity-100' : 'opacity-0'}`}
          aria-hidden={!showFilters}
          style={{ maxHeight: showFilters ? (filtersWrapperRef.current?.scrollHeight ?? 0) : 0 }}
        >
          <div ref={filtersWrapperRef}>
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                  {/* Categoria */}
                  <div className="w-full">
                    <Label htmlFor="category" className="mb-1 block">Categoria</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecionar categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Categorias</SelectLabel>
                          <SelectItem value="all">Todas</SelectItem>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Preço mínimo */}
                  <div className="w-full">
                    <Label htmlFor="min-price" className="mb-1 block">Preço mínimo</Label>
                    <Input
                      id="min-price"
                      type="number"
                      placeholder="0"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  {/* Preço máximo */}
                  <div className="w-full">
                    <Label htmlFor="max-price" className="mb-1 block">Preço máximo</Label>
                    <Input
                      id="max-price"
                      type="number"
                      placeholder="1000"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  {/* Ordenação */}
                  <div className="w-full">
                    <Label htmlFor="sort" className="mb-1 block">Ordenar por</Label>
                    <Select value={sort} onValueChange={setSort}>
                      <SelectTrigger id="sort" className="w-full">
                        <SelectValue placeholder="Relevância" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevance">Relevância</SelectItem>
                        <SelectItem value="price_low">Menor preço</SelectItem>
                        <SelectItem value="price_high">Maior preço</SelectItem>
                        <SelectItem value="name_asc">Nome A-Z</SelectItem>
                        <SelectItem value="name_desc">Nome Z-A</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Ações */}
                  <div className="w-full flex gap-2 md:justify-end">
                    <Button onClick={() => handleSearch()} className="w-full md:w-auto">
                      Aplicar Filtros
                    </Button>
                    <Button variant="outline" onClick={clearFilters} className="w-full md:w-auto">
                      Limpar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

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
              variant="destructive" 
              size="sm" 
              onClick={clearFilters}
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

      {pagination && pagination.last_page > 1 && (
        <Pagination>
          <PaginationContent>
            {/* Previous */}
            <PaginationItem>
              <PaginationPrevious
                href="#"
                aria-disabled={pagination.current_page === 1}
                className={pagination.current_page === 1 ? 'pointer-events-none opacity-50' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  if (pagination.current_page === 1) return;
                  goToPreviousPage();
                }}
              />
              
            </PaginationItem>

            {/* First page */}
            <PaginationItem>
              <PaginationLink
                href="#"
                isActive={pagination.current_page === 1}
                onClick={(e) => {
                  e.preventDefault();
                  if (pagination.current_page !== 1) goToPage(1);
                }}
              >
                1
              </PaginationLink>
            </PaginationItem>

            {/* Left ellipsis */}
            {pagination.last_page > 5 && middleRange.start > 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {/* Middle pages */}
            {pagination.last_page > 1 && Array.from({ length: Math.max(0, middleRange.end - middleRange.start + 1) }).map((_, idx) => {
              const page = middleRange.start + idx;
              if (page <= 1 || page >= pagination.last_page) return null;
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={pagination.current_page === page}
                    onClick={(e) => {
                      e.preventDefault();
                      if (pagination.current_page !== page) goToPage(page);
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            {/* Right ellipsis */}
            {pagination.last_page > 5 && middleRange.end < pagination.last_page - 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {/* Last page */}
            {pagination.last_page > 1 && (
              <PaginationItem>
                <PaginationLink
                  href="#"
                  isActive={pagination.current_page === pagination.last_page}
                  onClick={(e) => {
                    e.preventDefault();
                    if (pagination.current_page !== pagination.last_page) goToPage(pagination.last_page);
                  }}
                >
                  {pagination.last_page}
                </PaginationLink>
              </PaginationItem>
            )}

            {/* Next */}
            <PaginationItem>
              <PaginationNext
                href="#"
                aria-disabled={pagination.current_page === pagination.last_page}
                className={pagination.current_page === pagination.last_page ? 'pointer-events-none opacity-50' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  if (pagination.current_page === pagination.last_page) return;
                  goToNextPage();
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      
    </div>
  );
}