import { request } from './api';

export const taskService = {
  async list() {
    return request('/tasks/');
  },

  async get(id: number) {
    return request(`/tasks/${id}/`);
  },

  async create(payload: any) {
    return request('/tasks/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async update(id: number, payload: any) {
    return request(`/tasks/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async delete(id: number) {
    return request(`/tasks/${id}/`, {
      method: 'DELETE',
    });
  },
};
