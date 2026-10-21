import { apiFetch } from './apiClient';

export const authApi = {
  login: (email, password) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (payload) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(payload) })
};
