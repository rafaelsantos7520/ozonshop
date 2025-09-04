'use client';

import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface ErrorFallbackProps {
  title?: string;
  message?: string;
  showRetry?: boolean;
  showHomeButton?: boolean;
  onRetry?: () => void;
  variant?: 'default' | 'api' | 'network' | 'notFound';
}

const errorVariants = {
  default: {
    title: 'Algo deu errado',
    message: 'Ocorreu um erro inesperado. Tente novamente em alguns instantes.',
    icon: AlertCircle
  },
  api: {
    title: 'Serviço temporariamente indisponível',
    message: 'Nossos serviços estão em manutenção. Voltaremos em breve!',
    icon: AlertCircle
  },
  network: {
    title: 'Problema de conexão',
    message: 'Verifique sua conexão com a internet e tente novamente.',
    icon: AlertCircle
  },
  notFound: {
    title: 'Página não encontrada',
    message: 'O conteúdo que você está procurando não foi encontrado.',
    icon: AlertCircle
  }
};

export default function ErrorFallback({
  title,
  message,
  showRetry = true,
  showHomeButton = true,
  onRetry,
  variant = 'default'
}: ErrorFallbackProps) {
  const errorConfig = errorVariants[variant];
  const Icon = errorConfig.icon;
  
  const displayTitle = title || errorConfig.title;
  const displayMessage = message || errorConfig.message;

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <Icon className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">
            {displayTitle}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {displayMessage}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {showRetry && (
            <Button 
              onClick={handleRetry}
              className="w-full"
              variant="default"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Tentar novamente
            </Button>
          )}
          {showHomeButton && (
            <Button 
              asChild
              variant="outline"
              className="w-full"
            >
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Voltar ao início
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Componente específico para erros de API
export function ApiErrorFallback(props: Omit<ErrorFallbackProps, 'variant'>) {
  return <ErrorFallback {...props} variant="api" />;
}

// Componente específico para erros de rede
export function NetworkErrorFallback(props: Omit<ErrorFallbackProps, 'variant'>) {
  return <ErrorFallback {...props} variant="network" />;
}

// Componente específico para página não encontrada
export function NotFoundErrorFallback(props: Omit<ErrorFallbackProps, 'variant'>) {
  return <ErrorFallback {...props} variant="notFound" />;
}