const API_BASE_URL = 'http://localhost:5000/api';

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('shopagent_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        // Clear invalid token if session expired
        localStorage.removeItem('shopagent_token');
        localStorage.removeItem('shopagent_user');
      }
      throw new Error(data.message || data.error || 'An error occurred during the request.');
    }

    return data;
  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error.message);
    throw error;
  }
};

export const api = {
  get: (endpoint, opts) => apiRequest(endpoint, { method: 'GET', ...opts }),
  post: (endpoint, body, opts) => apiRequest(endpoint, { method: 'POST', body: JSON.stringify(body), ...opts }),
  put: (endpoint, body, opts) => apiRequest(endpoint, { method: 'PUT', body: JSON.stringify(body), ...opts }),
  patch: (endpoint, body, opts) => apiRequest(endpoint, { method: 'PATCH', body: JSON.stringify(body), ...opts }),
  delete: (endpoint, opts) => apiRequest(endpoint, { method: 'DELETE', ...opts })
};

export const apiFetch = apiRequest;
export default apiRequest;
