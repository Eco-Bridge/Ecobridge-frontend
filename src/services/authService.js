import apiClient, { setStoredAuth, clearStoredAuth } from './apiClient';

export const authService = {
  /**
   * Register a new user account (Public)
   * Returns JWT token + 50 welcome eco-points
   */
  async register({ name, email, phone, password, role = 'USER', address }) {
    const data = await apiClient.post('/api/auth/register', {
      name,
      email,
      phone,
      password,
      role,
      address,
    });

    if (data.token) {
      setStoredAuth(data.token, data.user || data);
    }
    return data;
  },

  /**
   * Authenticate with email/phone & password (Public)
   * Returns JWT token and user info
   */
  async login({ email, password }) {
    const data = await apiClient.post('/api/auth/login', {
      email,
      password,
    });

    const response = data.data || data;
    const token = response.token || response.accessToken;
    const user = response.user || data.user;

    if (token) {
      setStoredAuth(token, user);
    }

    return { ...data, token, user };
  },

  /**
   * Blacklist current JWT token in DB (Bearer protected)
   */
  async logout() {
    try {
      await apiClient.post('/api/auth/logout');
    } finally {
      clearStoredAuth();
    }
  },

  /**
   * Get authenticated user profile, balances & recent recycling history (Bearer protected)
   */
  async getMe() {
    return apiClient.get('/api/auth/me');
  },

  /**
   * Update name, phone number, address or avatar URL (Bearer protected)
   */
  async updateProfile(profileData) {
    const data = await apiClient.put('/api/auth/profile', profileData);
    const response = data?.data || data;
    const user = response?.user || response?.data || response;

    if (user) {
      setStoredAuth(null, user);
    }

    return { ...data, user };
  },

  /**
   * Change password requiring current password verification (Bearer protected)
   */
  async changePassword({ currentPassword, newPassword }) {
    return apiClient.put('/api/auth/change-password', {
      currentPassword,
      newPassword,
    });
  },

  /**
   * Generate a 15-minute SHA-256 reset token (Public)
   */
  async forgotPassword({ email }) {
    return apiClient.post('/api/auth/forgot-password', { email });
  },

  /**
   * Set a new password using the reset token. Logs user in automatically (Public)
   */
  async resetPassword(token, { newPassword }) {
    const data = await apiClient.put(`/api/auth/reset-password/${token}`, {
      newPassword,
    });
    if (data.token) {
      setStoredAuth(data.token, data.user || data);
    }
    return data;
  },
};

export default authService;
