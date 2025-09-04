'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '@/context/CartContext';
import { useCart } from '@/context/CartContext';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { useConfirmation } from '@/hooks/useConfirmation';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { removeFromCart, updateQuantity } = useCart();
  const confirmation = useConfirmation();

  const handleRemoveItem = () => {
    confirmation.showConfirmation(
      {
        title: 'Remover produto do carrinho',
        description: `Tem certeza que deseja remover "${item.product.name}" do seu carrinho?`,
        confirmText: 'Remover',
        cancelText: 'Cancelar',
        variant: 'danger'
      },
      async () => {
        await removeFromCart(item.id);
      }
    );
  };

  const handleIncreaseQuantity = async () => {
    await updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecreaseQuantity = async () => {
    if (item.quantity > 1) {
      await updateQuantity(item.id, item.quantity - 1);
    } else {
      handleRemoveItem();
    }
  };

  const itemTotal = Number(item.product.price) * item.quantity;

  return (
    <>
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Imagem do produto */}
            <div className="relative w-16 h-16 flex-shrink-0">
              <Image
                src={item.product.image}
                alt={item.product.name}
                fill
                className="object-cover rounded-md"
              />
            </div>

            {/* Informações do produto */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 truncate">
                {item.product.name}
              </h3>
              <p className="text-sm text-gray-500">
                R$ {Number(item.product.price).toFixed(2).replace('.', ',')}
              </p>
            </div>

            {/* Controles de quantidade */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDecreaseQuantity}
                className="w-8 h-8 p-0"
              >
                <Minus className="w-4 h-4" />
              </Button>
              
              <span className="w-8 text-center font-medium">
                {item.quantity}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleIncreaseQuantity}
                className="w-8 h-8 p-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Preço total */}
            <div className="text-right">
              <p className="font-semibold text-gray-900">
                R$ {itemTotal.toFixed(2).replace('.', ',')}
              </p>
            </div>

            {/* Botão de remover */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveItem}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal de confirmação */}
      <ConfirmationModal
        isOpen={confirmation.isOpen}
        onClose={confirmation.hideConfirmation}
        onConfirm={confirmation.handleConfirm}
        title={confirmation.config?.title || ''}
        description={confirmation.config?.description || ''}
        confirmText={confirmation.config?.confirmText}
        cancelText={confirmation.config?.cancelText}
        variant={confirmation.config?.variant}
        isLoading={confirmation.isLoading}
      />
    </>
  );
}