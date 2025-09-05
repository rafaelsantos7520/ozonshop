'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { registerAction } from '@/app/actions/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';

const signupSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  password_confirmation: z.string().min(6, 'Confirmação de senha deve ter pelo menos 6 caracteres')
}).refine((data) => data.password === data.password_confirmation, {
  message: "As senhas não coincidem",
  path: ["password_confirmation"],
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  async function onSubmit(data: SignupFormData) {
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('password_confirmation', data.password_confirmation);
    
    const result = await registerAction(formData);
    
    if (result.success) {
      setSuccess('Conta criada com sucesso! Redirecionando para o login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } else if (result.error) {
      setError(result.error);
    }
    
    setIsLoading(false);
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Criar Conta</CardTitle>
          <p className="text-gray-600">Preencha os dados para criar sua conta</p>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="João Silva"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="joao@email.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="********"
                  {...register('password')}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="password_confirmation">Confirmar Senha</Label>
              <div className="relative">
                <Input
                  id="password_confirmation"
                  type={showPasswordConfirmation ? 'text' : 'password'}
                  placeholder="********"
                  {...register('password_confirmation')}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPasswordConfirmation ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password_confirmation && (
                <p className="text-sm text-red-600 mt-1">{errors.password_confirmation.message}</p>
              )}
            </div>
          
            <Button 
              type="submit" 
              className="w-full text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Criando conta...' : 'Criar Conta'}
            </Button>
          </form>
          <div className="text-center text-sm text-gray-600 mt-6">
            Já tem uma conta? {' '}
            <Link href="/login" className="text-blue-600 hover:underline">
              Faça login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}