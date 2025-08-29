const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://store.ozonteck.local:8000";

interface FetchOptions extends RequestInit {
  revalidate?: number;
  cache?: 'force-cache' | 'no-store' | 'no-cache';
}

// Função para obter o token do cookie
function getAuthToken(): string | null {
  if (typeof document === 'undefined') {
    console.log('🔍 [getAuthToken] Executando no servidor, retornando null');
    return null; // Server-side
  }
  
  console.log('🔍 [getAuthToken] Todos os cookies:', document.cookie);
  
  const cookies = document.cookie.split(';');
  console.log('🔍 [getAuthToken] Cookies separados:', cookies);
  
  const authCookie = cookies.find(cookie => 
    cookie.trim().startsWith('auth-token=')
  );
  
  console.log('🔍 [getAuthToken] Cookie auth-token encontrado:', authCookie);
  
  if (authCookie) {
    const token = authCookie.split('=')[1];
    console.log('🔍 [getAuthToken] Token extraído:', token ? `${token.substring(0, 20)}...` : 'vazio');
    return token;
  }
  
  console.log('🔍 [getAuthToken] Nenhum cookie auth-token encontrado');
  return null;
}

class ApiFetch {
  private baseURL: string;
  private defaultHeaders: HeadersInit;

  constructor(baseURL: string) {
    this.baseURL = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string, 
    options: FetchOptions = {}
  ): Promise<T> {
    const { revalidate, cache, headers, ...restOptions } = options;
    
    const url = `${this.baseURL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    
    // Obter token de autenticação
    const authToken = getAuthToken();
    console.log('🔑 [apiFetch] Token obtido:', authToken ? `${authToken.substring(0, 20)}...` : 'null');
    
    const requestHeaders: HeadersInit = {
      ...this.defaultHeaders,
      ...headers,
    };
    
    // Adicionar token de autorização se disponível
    if (authToken) {
      (requestHeaders as any)['Authorization'] = `Bearer ${authToken}`;
      console.log('✅ [apiFetch] Header Authorization adicionado');
    } else {
      console.log('❌ [apiFetch] Nenhum token encontrado, requisição sem autenticação');
    }
    
    const fetchOptions: RequestInit = {
      headers: requestHeaders,
      credentials: 'include', 
      ...restOptions,
    };

    if (revalidate !== undefined) {
      (fetchOptions as any).next = { revalidate };
    }
    
    if (cache) {
      fetchOptions.cache = cache;
    }

    console.log('🌐 [apiFetch] Fazendo requisição:', {
      method: fetchOptions.method || 'GET',
      url,
      headers: fetchOptions.headers,
      credentials: fetchOptions.credentials,
      body: fetchOptions.body
    });

    const response = await fetch(url, fetchOptions);
    
    console.log('📡 [apiFetch] Resposta recebida:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      url: response.url
    });
    
    const data = await response.json();
    console.log('📄 [apiFetch] Dados da resposta:', data);
    
    return data;
  }

  // GET com cache opcional
  async get<T>(endpoint: string, revalidate?: number): Promise<T> {
    const options: FetchOptions = { method: 'GET' };
    
    if (revalidate !== undefined) {
      options.revalidate = revalidate;
    } else {
      options.cache = 'no-store';
    }
    
    return this.request<T>(endpoint, options);
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      cache: 'no-store'
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      cache: 'no-store'
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      cache: 'no-store'
    });
  }
}

export const apiFetch = new ApiFetch(API_BASE_URL);