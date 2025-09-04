'use client';

import { useState, useCallback } from 'react';

export interface ConfirmationConfig {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export interface UseConfirmationReturn {
  isOpen: boolean;
  isLoading: boolean;
  config: ConfirmationConfig | null;
  showConfirmation: (config: ConfirmationConfig, onConfirm: () => void | Promise<void>) => void;
  hideConfirmation: () => void;
  handleConfirm: () => void;
}

export function useConfirmation(): UseConfirmationReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<ConfirmationConfig | null>(null);
  const [onConfirmCallback, setOnConfirmCallback] = useState<(() => void | Promise<void>) | null>(null);

  const showConfirmation = useCallback((config: ConfirmationConfig, onConfirm: () => void | Promise<void>) => {
    setConfig(config);
    setOnConfirmCallback(() => onConfirm);
    setIsOpen(true);
  }, []);

  const hideConfirmation = useCallback(() => {
    setIsOpen(false);
    setIsLoading(false);
    setConfig(null);
    setOnConfirmCallback(null);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!onConfirmCallback) return;

    try {
      setIsLoading(true);
      const result = onConfirmCallback();
      
      // Se a função retorna uma Promise, aguarda ela
      if (result instanceof Promise) {
        await result;
      }
      
      hideConfirmation();
    } catch (error) {
      console.error('Erro ao executar confirmação:', error);
      setIsLoading(false);
      // Não fecha o modal em caso de erro para que o usuário possa tentar novamente
    }
  }, [onConfirmCallback, hideConfirmation]);

  return {
    isOpen,
    isLoading,
    config,
    showConfirmation,
    hideConfirmation,
    handleConfirm
  };
}