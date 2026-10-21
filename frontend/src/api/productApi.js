import { apiFetch } from './apiClient';

export const productApi = {
  getAll: (params = '') => apiFetch(`/products${params}`),
  getById: (id) => apiFetch(`/products/${id}`)
};
