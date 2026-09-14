import apiClient from './apiClient';

export const notificationService = {
  async getNotifications(params = {}) {
    return apiClient.get('/api/notifications', params);
  },

  async markAllRead() {
    return apiClient.put('/api/notifications/read-all');
  },

  async markAsRead(id) {
    return apiClient.put(`/api/notifications/${id}/read`);
  },

  async deleteNotification(id) {
    return apiClient.delete(`/api/notifications/${id}`);
  },
};

export default notificationService;
