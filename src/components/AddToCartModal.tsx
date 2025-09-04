'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShoppingCart, CheckCircle, ArrowRight } from 'lucide-react';
import { IProduct } from '@/types/product';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: IProduct;
  quantity: number;
}

export function AddToCartModal({ isOpen, onClose, product, quantity }: AddToCartModalProps) {
  const router = useRouter();

  const handleContinueShopping = () => {
    onClose();
  };

  const handleGoToCart = () => {
    onClose();
    router.push('/cart');
  };

  const totalPrice = Number(product.price) * quantity;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            Produto adicionado ao carrinho!
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Product Info */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="relative w-16 h-16 flex-shrink-0">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover rounded-md"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 truncate">
                {product.name}
              </h3>
              <p className="text-sm text-gray-500">
                Quantidade: {quantity}
              </p>
              <p className="text-lg font-semibold text-green-600">
                R$ {totalPrice.toFixed(2).replace('.', ',')}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleGoToCart}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Finalizar Pedido
            </Button>
            
            <Button
              onClick={handleContinueShopping}
              variant="outline"
              className="w-full"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Continuar Comprando
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}