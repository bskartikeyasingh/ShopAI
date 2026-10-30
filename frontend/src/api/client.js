
const API_BASE_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:5000'
).replace(/\/+$/, '') + '/api';

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('shopagent_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json')
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('shopagent_token');
        localStorage.removeItem('shopagent_user');
      }

      const message =
        typeof data === 'object' && data !== null
          ? data.message || data.error || data.detail
          : data;

      throw new Error(
        message || 'An error occurred during the request.'
      );
    }

    return data;
  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error.message);
    throw error;
  }
};

export const api = {
  get: (endpoint, opts) =>
    apiRequest(endpoint, { ...opts, method: 'GET' }),

  post: (endpoint, body, opts) =>
    apiRequest(endpoint, {
      ...opts,
      method: 'POST',
      body: JSON.stringify(body),
    }),

  put: (endpoint, body, opts) =>
    apiRequest(endpoint, {
      ...opts,
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  patch: (endpoint, body, opts) =>
    apiRequest(endpoint, {
      ...opts,
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  delete: (endpoint, opts) =>
    apiRequest(endpoint, { ...opts, method: 'DELETE' }),
};

export const apiFetch = apiRequest;
export default apiRequest;
