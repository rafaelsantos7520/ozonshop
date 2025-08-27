'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Droplets, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useSearch } from '@/context/SearchContext';
import { SearchBar } from '@/components/SearchBar';

export function GlobalHeader() {
  const { cart } = useCart();
  const { setSearchQuery } = useSearch();

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-800">OZONTECK</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                Home
              </Link>
              <Link href="/#produtos" className="text-gray-600 hover:text-gray-900">
                Produtos
              </Link>
            </nav>
          </div>
          
       
          <div className="flex items-center space-x-4">
               <div className="flex-1 max-w-md mx-4 hidden md:block">
            <SearchBar onSearch={handleSearch} />
          </div>
          
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/cart">
              <Button variant="outline" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center rounded-full bg-red-500 text-white">
                    {cart.length}
                  </Badge>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
