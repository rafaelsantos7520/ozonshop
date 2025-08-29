'use client';

import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, total, isLoading } = useCart();
  const [loadingItems, setLoadingItems] = useState<Set<number>>(new Set());

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    setLoadingItems(prev => new Set(prev).add(itemId));
    try {
      await updateQuantity(itemId, newQuantity);
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
    } finally {
      setLoadingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    setLoadingItems(prev => new Set(prev).add(itemId));
    try {
      await removeFromCart(itemId);
    } catch (error) {
      console.error('Erro ao remover item:', error);
    } finally {
      setLoadingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
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
                    <Skeleton className="h-8 w-32" />
                  </div>
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
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Seu Carrinho</h1>

        {cart.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600 mb-4">Seu carrinho está vazio.</p>
            <Link href="/">
              <Button size="lg">Voltar às Compras</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map(item => {
                const isItemLoading = loadingItems.has(item.id);
                return (
                  <Card key={item.id} className="flex items-center p-4">
                    <div className="relative w-24 h-24 flex-shrink-0 mr-4">
                      {item.product.image && (
                        <Image 
                          src={item.product.image} 
                          alt={item.product.name} 
                          fill 
                          className="object-contain" 
                        />
                      )}
                    </div>
                    <div className="flex-grow">
                      <h2 className="text-lg font-semibold text-gray-800">{item.product.name}</h2>
                      <p className="text-gray-600">
                        R$ {(parseFloat(item.product.price) || 0).toFixed(2).replace('.', ',')}
                      </p>
                      <div className="flex items-center mt-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isItemLoading}
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="mx-2 min-w-[2rem] text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isItemLoading}
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-lg font-semibold text-gray-900 mb-2">
                        R$ {((parseFloat(item.product.price) || 0) * item.quantity).toFixed(2).replace('.', ',')}
                      </p>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={isItemLoading}
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
            
            <div className="lg:col-span-1">
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Resumo do Pedido</h2>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>R$ {total.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>R$ {total.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
                <Link href="/checkout">
                  <Button className="w-full" size="lg">
                    Finalizar Compra
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}