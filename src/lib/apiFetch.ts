const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://34.207.78.115/";

interface FetchOptions extends RequestInit {
  revalidate?: number;
  cache?: 'force-cache' | 'no-store' | 'no-cache';
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
    
    const fetchOptions: RequestInit = {
      headers: {
        ...this.defaultHeaders,
        ...headers,
      },
      ...restOptions,
    };

    if (revalidate !== undefined) {
      (fetchOptions as any).next = { revalidate };
    }
    
    if (cache) {
      fetchOptions.cache = cache;
    }

    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

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

  // DELETE (sempre sem cache)
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      cache: 'no-store'
    });
  }
}

export const apiFetch = new ApiFetch(API_BASE_URL);