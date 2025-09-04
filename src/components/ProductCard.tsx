'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, ShoppingCart } from 'lucide-react';
import { ProductCardProps } from '@/types/components';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { IProduct } from '@/types/product';
import { AddToCartModal } from '@/components/AddToCartModal';
import { LoginRequiredModal } from '@/components/LoginRequiredModal';

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();  
  const { isAuthenticated, } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isHovered, setIsHovered] = useState(false);
  const originalPrice = product.price ? Number(product.price) * 1.5 : 0;
  const discount = 32;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      await addToCart(product as IProduct, 1);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Erro ao adicionar produto ao carrinho:', error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="w-full">
      <Card 
        className="p-0 gap-1  border-0 shadow-none transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative h-[170px] md:h-[280px] bg-gray-50 overflow-hidden">
          <Link href={`/product/${product.slug}`}>
            <Image
              src={"/images/sof2.webp"}
              alt={product.name}
              fill
              className={`rounded-t-xl object-cover transition-all duration-700 ease-in-out ${
                isHovered && product.secondary_image ? 'opacity-0' : 'opacity-100'
              }`}
            />
          </Link>

          {/* Imagem secundária */}
          {product.secondary_image && (
            <Link href={`/product/${product.slug}`}>
              <Image
                src={"/images/sof1.webp"}
                alt={product.name}
                fill
                className={`rounded-t-xl object-cover transition-all duration-700 ease-in-out ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </Link>
          )}  
                   
          {/* Botões no desktop - hover sobre a imagem */}
          <div className={`hidden md:flex absolute bottom-3 left-3 right-3 items-center justify-center gap-2 transition-all duration-500 ease-out ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <Link
              href={`/product/${product.slug}`}
              className="py-1.5 px-3 flex items-center justify-center rounded-lg bg-white/95 text-gray-700 border border-gray-200 hover:bg-white hover:text-gray-900 transition-all duration-200 backdrop-blur-sm text-sm font-medium"
            >
              <Eye className="w-4 h-4 mr-1.5" />
              <span>Ver mais</span>
            </Link>
            <Button
              size="sm"
              variant="outline"
              className="py-1.5 px-3 rounded-lg bg-white/95 text-gray-700 border-gray-200 hover:bg-white hover:text-gray-900 transition-all duration-200 backdrop-blur-sm text-sm font-medium"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-4 h-4 mr-1.5" />
              <span>Carrinho</span>
            </Button>
          </div>
        </div>
        
        {/* Botões no mobile - apenas ícones */}
        <div className="md:hidden px-2 py-1.5 flex items-center justify-center gap-2">
          <Link
            href={`/product/${product.slug}`}
            className="p-1.5 flex items-center justify-center rounded-lg bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 transition-all duration-200"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <Button
            size="sm"
            variant="outline"
            className="p-1.5 rounded-lg  transition-all duration-200"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
        
        <Link href={`/product/${product.slug}`} className="flex-1 flex flex-col">
          <div className="px-2 py-1.5 md:px-3 md:py-2 flex-1 flex flex-col">
            <h3 className="text-xs md:text-sm font-medium text-gray-900 line-clamp-2 leading-tight mb-1">
              {product.name}
            </h3>
            
            <div className="flex flex-col items-start justify-start mt-auto">
              <div className="flex flex-col space-y-0.5">
                {product.price && (
                  <>
                    <span className="text-sm md:text-base font-bold text-gray-900">
                      {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(product.price))}
                    </span>
                    <div className="flex items-center space-x-1">
                      <small className="text-xs text-gray-500 line-through">
                        {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(originalPrice)}
                      </small>
                      <span className="text-xs text-green-600 font-medium">-{discount}%</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </Link>
      </Card>
      
      {/* Modais */}
      <AddToCartModal 
         isOpen={isModalOpen}
         onClose={() => setIsModalOpen(false)}
         product={product}
         quantity={1}
       />
      
      <LoginRequiredModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}