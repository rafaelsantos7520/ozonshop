'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Trash2, CheckCircle, X } from 'lucide-react';

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'warning',
  isLoading = false
}: ConfirmationModalProps) {
  const getVariantConfig = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: <Trash2 className="w-5 h-5" />,
          iconColor: 'text-red-600',
          titleColor: 'text-red-600',
          confirmButtonClass: 'bg-red-600 hover:bg-red-700 text-white'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-5 h-5" />,
          iconColor: 'text-yellow-600',
          titleColor: 'text-yellow-600',
          confirmButtonClass: 'bg-yellow-600 hover:bg-yellow-700 text-white'
        };
      case 'info':
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          iconColor: 'text-blue-600',
          titleColor: 'text-blue-600',
          confirmButtonClass: 'bg-blue-600 hover:bg-blue-700 text-white'
        };
      default:
        return {
          icon: <AlertTriangle className="w-5 h-5" />,
          iconColor: 'text-yellow-600',
          titleColor: 'text-yellow-600',
          confirmButtonClass: 'bg-yellow-600 hover:bg-yellow-700 text-white'
        };
    }
  };

  const config = getVariantConfig();

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${config.titleColor}`}>
            <span className={config.iconColor}>
              {config.icon}
            </span>
            {title}
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-3 mt-6">
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`w-full ${config.confirmButtonClass} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processando...
              </div>
            ) : (
              confirmText
            )}
          </Button>
          
          <Button
            onClick={onClose}
            variant="outline"
            disabled={isLoading}
            className="w-full"
          >
            <X className="w-4 h-4 mr-2" />
            {cancelText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}