'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Plus, Minus, Trash2 } from 'lucide-react'
// import { toast } from 'sonner' // Removido - não instalado
import {
  addToCartAction,
  removeFromCartAction,
  updateCartItemAction,
  clearCartAction
} from '@/app/actions/cart'

interface CartItem {
  id: number
  product_id: number
  product_name: string
  quantity: number
  price: number
  total: number
}

interface CartWithServerActionsProps {
  initialCart: CartItem[]
}

/**
 * Exemplo de componente que usa Server Actions para operações do carrinho
 * Este é um exemplo alternativo ao CartContext que usa API Routes
 */
export function CartWithServerActions({ initialCart }: CartWithServerActionsProps) {
  const [cart, setCart] = useState<CartItem[]>(initialCart)
  const [isPending, startTransition] = useTransition()

  // Adicionar produto ao carrinho usando Server Action
  const handleAddToCart = (productId: number, quantity: number = 1) => {
    startTransition(async () => {
      try {
        const result = await addToCartAction({ product_id: productId, quantity })
        
        if (result.success) {
          setCart(result.data)
          console.log('✅ Produto adicionado ao carrinho!')
        } else {
          console.error('❌ Erro ao adicionar produto:', result.error)
        }
      } catch (error) {
        console.error('Erro ao adicionar ao carrinho:', error)
        console.error('❌ Erro inesperado ao adicionar produto')
      }
    })
  }

  // Atualizar quantidade usando Server Action
  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return

    startTransition(async () => {
      try {
        const result = await updateCartItemAction(itemId, newQuantity)
        
        if (result.success) {
          setCart(result.data)
          console.log('✅ Quantidade atualizada!')
        } else {
          console.error('❌ Erro ao atualizar quantidade:', result.error)
        }
      } catch (error) {
        console.error('Erro ao atualizar quantidade:', error)
        console.error('❌ Erro inesperado ao atualizar quantidade')
      }
    })
  }

  // Remover item usando Server Action
  const handleRemoveItem = (itemId: number) => {
    startTransition(async () => {
      try {
        const result = await removeFromCartAction(itemId)
        
        if (result.success) {
          setCart(result.data)
          console.log('✅ Item removido do carrinho!')
        } else {
          console.error('❌ Erro ao remover item:', result.error)
        }
      } catch (error) {
        console.error('Erro ao remover item:', error)
        console.error('❌ Erro inesperado ao remover item')
      }
    })
  }

  // Limpar carrinho usando Server Action
  const handleClearCart = () => {
    startTransition(async () => {
      try {
        const result = await clearCartAction()
        
        if (result.success) {
          setCart([])
          console.log('✅ Carrinho limpo!')
        } else {
          console.error('❌ Erro ao limpar carrinho:', result.error)
        }
      } catch (error) {
        console.error('Erro ao limpar carrinho:', error)
        console.error('❌ Erro inesperado ao limpar carrinho')
      }
    })
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + item.total, 0)

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          Carrinho com Server Actions
          <Badge variant="secondary">{totalItems} itens</Badge>
        </CardTitle>
        
        {cart.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearCart}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Limpar
          </Button>
        )}
      </CardHeader>

      <CardContent>
        {cart.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Seu carrinho está vazio
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="font-medium">{item.product_name}</h3>
                  <p className="text-sm text-muted-foreground">
                    R$ {item.price.toFixed(2)} cada
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    disabled={isPending || item.quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>

                  <span className="w-8 text-center">{item.quantity}</span>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    disabled={isPending}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="text-right ml-4">
                  <p className="font-medium">R$ {item.total.toFixed(2)}</p>
                </div>
              </div>
            ))}

            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total:</span>
                <span>R$ {totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Exemplo de botão para adicionar produto (apenas para demonstração) */}
        <div className="mt-6 pt-4 border-t">
          <p className="text-sm text-muted-foreground mb-2">
            Exemplo: Adicionar produto ID 1
          </p>
          <Button
            onClick={() => handleAddToCart(1, 1)}
            disabled={isPending}
            className="w-full"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            Adicionar Produto de Exemplo
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Hook personalizado para usar Server Actions do carrinho
 * Alternativa ao useCart que usa Context + API Routes
 */
export function useCartServerActions() {
  const [isPending, startTransition] = useTransition()

  const addToCart = (productId: number, quantity: number = 1) => {
    return new Promise((resolve, reject) => {
      startTransition(async () => {
        try {
          const result = await addToCartAction({ product_id: productId, quantity })
          if (result.success) {
            resolve(result.data)
          } else {
            reject(new Error(result.error))
          }
        } catch (error) {
          reject(error)
        }
      })
    })
  }

  const removeFromCart = (itemId: number) => {
    return new Promise((resolve, reject) => {
      startTransition(async () => {
        try {
          const result = await removeFromCartAction(itemId)
          if (result.success) {
            resolve(result.data)
          } else {
            reject(new Error(result.error))
          }
        } catch (error) {
          reject(error)
        }
      })
    })
  }

  const updateQuantity = (itemId: number, quantity: number) => {
    return new Promise((resolve, reject) => {
      startTransition(async () => {
        try {
          const result = await updateCartItemAction(itemId, quantity)
          if (result.success) {
            resolve(result.data)
          } else {
            reject(new Error(result.error))
          }
        } catch (error) {
          reject(error)
        }
      })
    })
  }

  const clearCart = () => {
    return new Promise((resolve, reject) => {
      startTransition(async () => {
        try {
          const result = await clearCartAction()
          if (result.success) {
            resolve(result.data)
          } else {
            reject(new Error(result.error))
          }
        } catch (error) {
          reject(error)
        }
      })
    })
  }

  return {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isPending
  }
}