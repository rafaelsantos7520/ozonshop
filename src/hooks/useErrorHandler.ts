import { useState, useCallback } from 'react';

interface ErrorState {
  hasError: boolean;
  error: Error | null;
  errorType: 'api' | 'network' | 'default' | 'notFound';
}

interface UseErrorHandlerReturn {
  errorState: ErrorState;
  setError: (error: Error, type?: ErrorState['errorType']) => void;
  clearError: () => void;
  handleAsyncError: <T>(asyncFn: () => Promise<T>, errorType?: ErrorState['errorType']) => Promise<T | null>;
}

export function useErrorHandler(): UseErrorHandlerReturn {
  const [errorState, setErrorState] = useState<ErrorState>({
    hasError: false,
    error: null,
    errorType: 'default'
  });

  const setError = useCallback((error: Error, type: ErrorState['errorType'] = 'default') => {
    setErrorState({
      hasError: true,
      error,
      errorType: type
    });
  }, []);

  const clearError = useCallback(() => {
    setErrorState({
      hasError: false,
      error: null,
      errorType: 'default'
    });
  }, []);

  const handleAsyncError = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    errorType: ErrorState['errorType'] = 'default'
  ): Promise<T | null> => {
    try {
      clearError();
      const result = await asyncFn();
      return result;
    } catch (error) {
      const errorInstance = error instanceof Error ? error : new Error('Erro desconhecido');
      
      // Determinar o tipo de erro baseado na mensagem ou tipo
      let detectedErrorType = errorType;
      if (errorInstance.message.includes('fetch') || errorInstance.message.includes('network')) {
        detectedErrorType = 'network';
      } else if (errorInstance.message.includes('API') || errorInstance.message.includes('server')) {
        detectedErrorType = 'api';
      } else if (errorInstance.message.includes('404') || errorInstance.message.includes('not found')) {
        detectedErrorType = 'notFound';
      }
      
      setError(errorInstance, detectedErrorType);
      return null;
    }
  }, [setError, clearError]);

  return {
    errorState,
    setError,
    clearError,
    handleAsyncError
  };
}

// Hook específico para erros de API
export function useApiErrorHandler() {
  const { errorState, setError, clearError, handleAsyncError } = useErrorHandler();
  
  const handleApiError = useCallback(<T>(asyncFn: () => Promise<T>) => {
    return handleAsyncError(asyncFn, 'api');
  }, [handleAsyncError]);
  
  return {
    errorState,
    setError: (error: Error) => setError(error, 'api'),
    clearError,
    handleApiError
  };
}