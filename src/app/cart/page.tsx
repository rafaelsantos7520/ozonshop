'use client';

import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();

  const total = cart.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * item.quantity, 0);

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
            {cart.map(item => (
              <Card key={item.id} className="flex items-center p-4">
                <div className="relative w-24 h-24 flex-shrink-0 mr-4">
                  {item.image && (
                    <Image src={item.image} alt={item.name} fill className="object-contain" />
                  )}
                </div>
                <div className="flex-grow">
                  <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
                  <p className="text-gray-600">R$ {(parseFloat(item.price) || 0).toFixed(2).replace('.', ',')}</p>
                  <div className="flex items-center mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </Button>
                    <span className="mx-2">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-4 text-red-500 hover:text-red-700"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                <div className="text-lg font-bold text-gray-900">
                  R$ {((parseFloat(item.price) || 0) * item.quantity).toFixed(2).replace('.', ',')}
                </div>
              </Card>
            ))}
          </div>

          <Card className="lg:col-span-1 p-6 h-fit sticky top-24">
            <CardHeader>
              <CardTitle className="text-2xl font-bold mb-4">Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center text-xl font-semibold text-gray-900 mb-6">
                <span>Total:</span>
                <span>R$ {total.toFixed(2).replace('.', ',')}</span>
              </div>
              <Button size="lg" className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white">
                Finalizar Compra
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
      </div>
    </ProtectedRoute>
  );
}