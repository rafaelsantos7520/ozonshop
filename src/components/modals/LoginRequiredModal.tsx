'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginRequiredModal({ isOpen, onClose }: LoginRequiredModalProps) {
  const router = useRouter();

  const handleLogin = () => {
    onClose();
    router.push('/login');
  };

  const handleSignup = () => {
    onClose();
    router.push('/signup');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-blue-600">
            <LogIn className="w-5 h-5" />
            Login Necessário
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center py-4">
            <p className="text-gray-600 mb-4">
              Para adicionar produtos ao carrinho, você precisa estar logado.
            </p>
            <p className="text-sm text-gray-500">
              Faça login ou crie uma conta para continuar suas compras.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Fazer Login
            </Button>
            
            <Button
              onClick={handleSignup}
              variant="outline"
              className="w-full"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Criar Conta
            </Button>
            
            <Button
              onClick={onClose}
              variant="destructive"
              className="w-full"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}