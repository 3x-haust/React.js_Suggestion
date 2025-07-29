const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:2083/api';

export class AuthenticationError extends Error {
  constructor(message: string = 'Authentication failed. Please login again.') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export const apiRequest = async (endpoint: string, accessToken?: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new AuthenticationError();
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const apiGet = (endpoint: string, accessToken?: string) => {
  return apiRequest(endpoint, accessToken, { method: 'GET' });
};

export const apiPost = (endpoint: string, data: unknown, accessToken?: string) => {
  return apiRequest(endpoint, accessToken, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const apiPatch = (endpoint: string, data: unknown, accessToken?: string) => {
  return apiRequest(endpoint, accessToken, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const apiDelete = (endpoint: string, accessToken?: string) => {
  return apiRequest(endpoint, accessToken, { method: 'DELETE' });
};
