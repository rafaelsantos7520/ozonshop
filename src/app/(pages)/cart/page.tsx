'use client';

import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CartItem } from '@/components/CartItem';
import { ConfirmationModal } from '@/components/modals/ConfirmationModal';
import { useConfirmation } from '@/hooks/useConfirmation';

import Link from 'next/link';
import { Trash2, ShoppingCart } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Skeleton } from '@/components/ui/skeleton';
import ButtonLink from '@/components/ui/button-link';

export default function CartPage() {
  const { 
    cart, 
    clearCart, 
    total, 
    isLoading
  } = useCart();
  const confirmation = useConfirmation();

  const handleClearCart = () => {
    confirmation.showConfirmation(
      {
        title: 'Limpar carrinho',
        description: 'Tem certeza que deseja remover todos os itens do seu carrinho? Esta ação não pode ser desfeita.',
        confirmText: 'Limpar Carrinho',
        cancelText: 'Cancelar',
        variant: 'danger'
      },
      async () => {
        await clearCart();
      }
    );
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Seu Carrinho</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="flex items-center p-4">
                  <Skeleton className="w-24 h-24 mr-4" />
                  <div className="flex-grow space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <Skeleton className="h-10 w-20" />
                </Card>
              ))}
            </div>
            <div className="lg:col-span-1">
              <Card className="p-6">
                <Skeleton className="h-8 w-full mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-10 w-full" />
              </Card>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <div className="container mx-auto py-8 px-4">
          <div className="text-center mb-8">
            <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-2">Seu Carrinho</h1>
            <p className="text-gray-600">Revise seus itens antes de finalizar a compra</p>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-12 h-12 text-gray-400" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Seu carrinho está vazio</h2>
                <p className="text-gray-600 mb-8">Que tal explorar nossos produtos e encontrar algo especial?</p>
                <Link href="/">
                  <Button size="lg" className="px-8 py-3">
                    Explorar Produtos
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Lista de itens do carrinho */}
                <div className="lg:col-span-2">
                  <Card className="overflow-hidden border-none">
                    <div className="px-6 py-4 ">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">
                          Itens no Carrinho ({cart.length})
                        </h2>
                        {cart.length > 1 && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleClearCart}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Limpar Tudo
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="p-4 space-y-4">
                      {cart.map(item => (
                        <CartItem key={item.id} item={item} />
                      ))}
                    </div>
                  </Card>
                </div>

                {/* Resumo do pedido */}
                <div className="lg:col-span-1">
                  <Card className="sticky top-4">
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Pedido</h3>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Subtotal ({cart.length} {cart.length === 1 ? 'item' : 'itens'})</span>
                          <span className="font-medium">R$ {total.toFixed(2).replace('.', ',')}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Frete</span>
                          <span className="font-medium text-green-600">Grátis</span>
                        </div>
                        <div className="border-t pt-3">
                          <div className="flex justify-between">
                            <span className="text-lg font-semibold text-gray-900">Total</span>
                            <span className="text-lg font-bold text-gray-900">R$ {total.toFixed(2).replace('.', ',')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                          <ButtonLink href="/checkout" variant="outline" className="w-full bg-cyan-600 text-white hover:bg-cyan-700 hover:text-white">
                            Finalizar Compra
                          </ButtonLink>
                          <ButtonLink variant="outline" href="/product" className="w-full">
                            Continuar Comprando
                          </ButtonLink>
                      </div>

                      <div className="mt-6 pt-6 border-t border-gray-100">
                        <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <ShoppingCart className="w-4 h-4" />
                            <span>Compra Segura</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

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
    </ProtectedRoute>
  );
}