import apiClient from './apiClient';

export const healthService = {
  /**
   * API root info page (Public)
   */
  async getApiInfo() {
    return apiClient.get('/');
  },

  /**
   * Server health check (Public)
   */
  async getHealth() {
    return apiClient.get('/api/health');
  },
};

export default healthService;
