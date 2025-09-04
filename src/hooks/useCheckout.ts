import { useMutation, useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { CheckoutData, CheckoutResponse, CheckoutDataResponse } from '@/types/checkout';

// Schema de validação para os dados do checkout
export const checkoutFormSchema = z.object({
  firstName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  lastName: z.string().min(2, 'Sobrenome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  zipCode: z.string().min(8, 'CEP deve ter 8 dígitos').max(9, 'CEP inválido'),
  street: z.string().min(5, 'Rua deve ter pelo menos 5 caracteres'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, 'Bairro deve ter pelo menos 2 caracteres'),
  city: z.string().min(2, 'Cidade deve ter pelo menos 2 caracteres'),
  state: z.string().min(2, 'Estado é obrigatório'),
});

export type CheckoutFormSchema = z.infer<typeof checkoutFormSchema>;

// Hook para buscar dados do checkout
export const useCheckoutData = () => {
  return useQuery<CheckoutDataResponse, Error>({
    queryKey: ['checkout-data'],
    queryFn: async () => {
      const response = await fetch('/api/cart/checkout-data/get', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`);
      }

      return response.json();
    },
    staleTime: 30 * 1000, // 30 segundos
    gcTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para processar o checkout
export const useCheckout = () => {
  return useMutation<CheckoutResponse, Error, CheckoutData>({
    mutationFn: async (checkoutData: CheckoutData) => {
      const response = await fetch('/api/cart/checkout-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(checkoutData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`);
      }

      return response.json();
    },
  });
};