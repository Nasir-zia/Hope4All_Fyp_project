import { API_BASE_URL } from '../config/config';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  token?: string;
  isFormData?: boolean;
  silent?: boolean;
}

export const apiClient = async <T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
  const { method = 'GET', headers = {}, body, token, isFormData = false, silent = false } = options;

  const url = `${API_BASE_URL}${endpoint}`;

  const requestHeaders: Record<string, string> = {
    ...headers,
  };

  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  if (!isFormData && !requestHeaders['Content-Type']) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  const config: RequestInit = {
    method,
    headers: requestHeaders,
  };

  if (body) {
    config.body = isFormData ? body : JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);

    let data: any;
    try {
      data = await response.json();
    } catch (e) {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    if (!response.ok) {
      const error = new Error(data?.message || `HTTP error! status: ${response.status}`);
      (error as any).status = response.status;
      throw error;
    }

    return data;
  } catch (error: any) {
    if (!silent) {
      console.error(`API Call Error [${method} ${endpoint}]:`, error);
    }
    throw error;
  }
};
