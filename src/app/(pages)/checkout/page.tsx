'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Plus, Minus, Star, Shield, Truck, CreditCard, Loader2 } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useCheckoutData, useCheckout, checkoutFormSchema, CheckoutFormSchema } from '@/hooks/useCheckout';
import { CheckoutData } from '@/types/checkout';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const router = useRouter();
  const [selectedShipping, setSelectedShipping] = useState<string>('');
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  
  const { data: checkoutData, isLoading: isLoadingData, error } = useCheckoutData();
  const checkoutMutation = useCheckout();
  
  const form = useForm<CheckoutFormSchema>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      zipCode: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
    },
  });

  const cartItems = checkoutData?.data?.cart_items || [];
  const shippingOptions = checkoutData?.data?.shipping_options || [];
  const paymentMethods = checkoutData?.data?.payment_methods || [];
  
  // Calcular totais
  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (parseFloat(item.price) * item.quantity);
  }, 0);
  
  const selectedShippingOption = shippingOptions.find(option => option.id === selectedShipping);
  const shippingCost = selectedShippingOption?.price || 0;
  const total = subtotal + shippingCost;

  const onSubmit = async (data: CheckoutFormSchema) => {
    if (!selectedShipping) {
      toast.error('Selecione uma opção de frete');
      return;
    }
    
    if (!selectedPayment) {
      toast.error('Selecione um método de pagamento');
      return;
    }

    const checkoutPayload: CheckoutData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      zipCode: data.zipCode,
      street: data.street,
      number: data.number,
      complement: data.complement,
      neighborhood: data.neighborhood,
      city: data.city,
      state: data.state,
      items: cartItems.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: parseFloat(item.price),
        name: item.product.name,
        image: item.product.image,
      })),
      subtotal,
      shipping: shippingCost,
      total,
      payment_method: selectedPayment,
      shipping_option: selectedShipping,
    };

    try {
      const result = await checkoutMutation.mutateAsync(checkoutPayload);
      
      if (result.success) {
        toast.success('Pedido realizado com sucesso!');
        if (result.payment_url) {
          window.location.href = result.payment_url;
        } else {
          router.push('/');
        }
      } else {
        toast.error(result.error || 'Erro ao processar pedido');
      }
    } catch (error) {
      toast.error('Erro ao processar pedido');
    }
  };

  if (isLoadingData) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !checkoutData?.success) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card className="p-6">
            <p className="text-red-600">Erro ao carregar dados do checkout</p>
            <Button onClick={() => router.push('/cart')} className="mt-4">
              Voltar ao carrinho
            </Button>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  if (cartItems.length === 0) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card className="p-6 text-center">
            <p className="text-gray-600 mb-4">Seu carrinho está vazio</p>
            <Button onClick={() => router.push('/')}>
              Continuar comprando
            </Button>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar</span>
            </Link>
            <div className="text-2xl font-bold text-gray-900">OZONTECK</div>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Side - Product Details */}
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Finalizar Compra</h1>
              <p className="text-gray-600">Revise seu pedido e preencha os dados de entrega</p>
            </div>

            {/* Products List */}
            <div className="space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex space-x-4">
                      <div className="relative w-24 h-24 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg flex items-center justify-center">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          width={80}
                          height={80}
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                            <p className="text-sm text-gray-600">SKU: {item.product.sku}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">
                              R$ {parseFloat(item.price).toFixed(2).replace('.', ',')}
                            </div>
                            <p className="text-sm text-gray-600">Qtd: {item.quantity}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

    
          </div>

          {/* Right Side - Order Summary & Form */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} itens)</span>
                  <span className="font-medium">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frete</span>
                  <span className="font-medium">
                    {selectedShippingOption ? `R$ ${shippingCost.toFixed(2).replace('.', ',')}` : 'Selecione o frete'}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">R$ {total.toFixed(2).replace('.', ',')}</span>
                </div>
              </CardContent>
            </Card>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Dados de Contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Nome</Label>
                      <Input
                        id="firstName"
                        {...form.register('firstName')}
                        placeholder="Seu nome"
                      />
                      {form.formState.errors.firstName && (
                        <p className="text-sm text-red-600 mt-1">{form.formState.errors.firstName.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Sobrenome</Label>
                      <Input
                        id="lastName"
                        {...form.register('lastName')}
                        placeholder="Seu sobrenome"
                      />
                      {form.formState.errors.lastName && (
                        <p className="text-sm text-red-600 mt-1">{form.formState.errors.lastName.message}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...form.register('email')}
                      placeholder="seu@email.com"
                    />
                    {form.formState.errors.email && (
                      <p className="text-sm text-red-600 mt-1">{form.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...form.register('phone')}
                      placeholder="(11) 99999-9999"
                    />
                    {form.formState.errors.phone && (
                      <p className="text-sm text-red-600 mt-1">{form.formState.errors.phone.message}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle>Endereço de Entrega</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="zipCode">CEP</Label>
                      <Input
                        id="zipCode"
                        {...form.register('zipCode')}
                        placeholder="00000-000"
                      />
                      {form.formState.errors.zipCode && (
                        <p className="text-sm text-red-600 mt-1">{form.formState.errors.zipCode.message}</p>
                      )}
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="street">Rua</Label>
                      <Input
                        id="street"
                        {...form.register('street')}
                        placeholder="Nome da rua"
                      />
                      {form.formState.errors.street && (
                        <p className="text-sm text-red-600 mt-1">{form.formState.errors.street.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="number">Número</Label>
                      <Input
                        id="number"
                        {...form.register('number')}
                        placeholder="123"
                      />
                      {form.formState.errors.number && (
                        <p className="text-sm text-red-600 mt-1">{form.formState.errors.number.message}</p>
                      )}
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="complement">Complemento</Label>
                      <Input
                        id="complement"
                        {...form.register('complement')}
                        placeholder="Apto, bloco, etc. (opcional)"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="neighborhood">Bairro</Label>
                      <Input
                        id="neighborhood"
                        {...form.register('neighborhood')}
                        placeholder="Nome do bairro"
                      />
                      {form.formState.errors.neighborhood && (
                        <p className="text-sm text-red-600 mt-1">{form.formState.errors.neighborhood.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="city">Cidade</Label>
                      <Input
                        id="city"
                        {...form.register('city')}
                        placeholder="Nome da cidade"
                      />
                      {form.formState.errors.city && (
                        <p className="text-sm text-red-600 mt-1">{form.formState.errors.city.message}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="state">Estado</Label>
                    <Select onValueChange={(value) => form.setValue('state', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SP">São Paulo</SelectItem>
                        <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                        <SelectItem value="MG">Minas Gerais</SelectItem>
                        <SelectItem value="PR">Paraná</SelectItem>
                        <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                        <SelectItem value="SC">Santa Catarina</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.state && (
                      <p className="text-sm text-red-600 mt-1">{form.formState.errors.state.message}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Options */}
              <Card>
                <CardHeader>
                  <CardTitle>Opções de Frete</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={selectedShipping} onValueChange={setSelectedShipping}>
                    {shippingOptions.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value={option.id} id={option.id} />
                        <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{option.name}</p>
                              <p className="text-sm text-gray-600">{option.days}</p>
                              {option.min_order && (
                                <p className="text-xs text-gray-500">Pedido mínimo: R$ {option.min_order.toFixed(2)}</p>
                              )}
                            </div>
                            <p className="font-bold">
                              {option.price === 0 ? 'Grátis' : `R$ ${option.price.toFixed(2).replace('.', ',')}`}
                            </p>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle>Método de Pagamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value={method.id} id={method.id} />
                        <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                          <p className="font-medium">{method.name}</p>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Checkout Button */}
              <Button 
                type="submit"
                size="lg" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold"
                disabled={checkoutMutation.isPending}
              >
                {checkoutMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Processando...
                  </>
                ) : (
                  `Finalizar Compra - R$ ${total.toFixed(2).replace('.', ',')}`
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                Ao finalizar a compra, você concorda com nossos termos de uso e política de privacidade.
              </p>
            </form>
          </div>
        </div>
      </div>
      </div>
    </ProtectedRoute>
  );
}