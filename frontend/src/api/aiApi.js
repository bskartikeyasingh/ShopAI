import { apiFetch } from './apiClient';

export const aiApi = {
  chat: (message, sellerContext = null) =>
    apiFetch('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, sellerContext })
    })
};
