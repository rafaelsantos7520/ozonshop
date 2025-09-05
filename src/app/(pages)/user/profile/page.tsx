'use client';

import React, { useState } from 'react';
import { useUserQuery } from '@/hooks/useAuthQuery';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import ProtectedRoute from '@/components/ProtectedRoute';

const profileSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

function ProfileContent() {
  const { data: user, isLoading, error } = useUserQuery();
  const { refetchUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
    },
  });

  // Atualizar valores do formulário quando user mudar
  React.useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user, form]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsSaving(true);
    try {
      // Aqui você implementaria a chamada para atualizar o perfil
      // const response = await updateUserProfile(data);
      
      // Simulando uma atualização bem-sucedida
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await refetchUser();
      setIsEditing(false);
      
      toast.success('Suas informações foram atualizadas com sucesso!');
    } catch (error) {
      toast.error('Ocorreu um erro ao atualizar seu perfil. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Alert variant="destructive">
          <AlertDescription>
            Erro ao carregar dados do perfil. Tente recarregar a página.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Alert>
          <AlertDescription>
            Usuário não encontrado. Faça login novamente.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Meu Perfil</h1>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>
              Editar Perfil
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>
              Gerencie suas informações pessoais e preferências de conta.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Avatar e informações básicas */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg font-semibold">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <div className="flex items-center space-x-2">
                    {user.is_admin && (
                      <Badge variant="secondary">Administrador</Badge>
                    )}
                    {user.email_verified_at ? (
                      <Badge variant="default">Email Verificado</Badge>
                    ) : (
                      <Badge variant="outline">Email Não Verificado</Badge>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {isEditing ? (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                         control={form.control}
                         name="name"
                         render={({ field }: { field: any }) => (
                           <FormItem>
                             <FormLabel>Nome Completo</FormLabel>
                             <FormControl>
                               <Input placeholder="Seu nome completo" {...field} />
                             </FormControl>
                             <FormMessage />
                           </FormItem>
                         )}
                       />

                      <FormField
                         control={form.control}
                         name="email"
                         render={({ field }: { field: any }) => (
                           <FormItem>
                             <FormLabel>Email</FormLabel>
                             <FormControl>
                               <Input placeholder="seu@email.com" type="email" {...field} />
                             </FormControl>
                             <FormMessage />
                           </FormItem>
                         )}
                       />

                      <FormField
                         control={form.control}
                         name="phone"
                         render={({ field }: { field: any }) => (
                           <FormItem>
                             <FormLabel>Telefone</FormLabel>
                             <FormControl>
                               <Input placeholder="(11) 99999-9999" {...field} />
                             </FormControl>
                             <FormMessage />
                           </FormItem>
                         )}
                       />
                    </div>

                    <FormField
                       control={form.control}
                       name="address"
                       render={({ field }: { field: any }) => (
                         <FormItem>
                           <FormLabel>Endereço</FormLabel>
                           <FormControl>
                             <Textarea 
                               placeholder="Seu endereço completo"
                               className="resize-none"
                               {...field}
                             />
                           </FormControl>
                           <FormMessage />
                         </FormItem>
                       )}
                     />

                    <div className="flex space-x-2">
                       <Button type="submit" isLoading={isSaving}>
                         Salvar Alterações
                       </Button>
                       <Button 
                         type="button" 
                         variant="outline" 
                         onClick={handleCancel}
                         disabled={isSaving}
                       >
                         Cancelar
                       </Button>
                     </div>
                  </form>
                </Form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Nome Completo
                    </Label>
                    <p className="text-sm">{user.name}</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Email
                    </Label>
                    <p className="text-sm">{user.email}</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Telefone
                    </Label>
                    <p className="text-sm">{user.phone || 'Não informado'}</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Membro desde
                    </Label>
                    <p className="text-sm">{formatDate(user.created_at)}</p>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Endereço
                    </Label>
                    <p className="text-sm">{user.address || 'Não informado'}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}