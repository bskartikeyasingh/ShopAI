import { apiFetch } from './apiClient';

export const orderApi = {
  checkout: (data) => apiFetch('/orders/checkout', { method: 'POST', body: JSON.stringify(data) }),
  getMyOrders: () => apiFetch('/orders/my-orders')
};
