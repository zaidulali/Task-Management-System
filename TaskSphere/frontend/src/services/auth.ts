import { request } from './api';

export const authService = {
  async register(payload: any) {
    return request('/accounts/register/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async login(payload: any) {
    const data = await request('/accounts/login/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (data && data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  },

  async logout() {
    await request('/accounts/logout/', {
      method: 'POST',
    });
    localStorage.removeItem('token');
  },
};
