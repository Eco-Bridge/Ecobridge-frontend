import apiClient from './apiClient';

export function normalizeRewardsResponse(response) {
  const data = response?.data && typeof response.data === 'object' && !Array.isArray(response.data)
    ? response.data
    : response || {};

  return {
    rewards: Array.isArray(data.rewards) ? data.rewards : Array.isArray(response) ? response : [],
    totalRewardsGivenOut: Number(data.totalRewardsGivenOut ?? data.summary?.totalRewardsGivenOut ?? 0),
    activeCatalog: Number(data.activeCatalog ?? data.summary?.activeCatalog ?? 0),
    redeemedThis: Number(data.redeemedThis ?? data.summary?.redeemedThis ?? 0),
    pagination: data.pagination || {},
  };
}

export const rewardsService = {
  /**
   * Browse active rewards catalog (Public)
   * Supports ?category, ?minPoints, ?maxPoints, ?page, ?limit
   */
  async getRewards(params = {}) {
    const response = await apiClient.get('/api/rewards', params);
    return normalizeRewardsResponse(response);
  },

  /**
   * Get full details of a single reward item (Public)
   */
  async getRewardById(id) {
    return apiClient.get(`/api/rewards/${id}`);
  },

  /**
   * Redeem eco-points for a reward (Bearer protected)
   * Atomically deducts points, decrements stock, generates unique voucher code.
   */
  async redeemReward({ rewardId, phone, notes }) {
    return apiClient.post('/api/rewards/redeem', {
      rewardId,
      phone,
      notes,
    });
  },

  /**
   * List all vouchers redeemed by the logged-in user (Bearer protected)
   * Supports ?status=ACTIVE|USED|EXPIRED
   */
  async getMyVouchers(params = {}) {
    return apiClient.get('/api/rewards/my-vouchers', params);
  },

  /**
   * Add a new reward to the catalog (ADMIN)
   * { title, description, category, partnerName, pointsRequired, stock, imageUrl }
   */
  async createReward(rewardData) {
    return apiClient.post('/api/rewards', rewardData);
  },

  /**
   * Update any reward field: title, description, pointsRequired, stock, isActive (ADMIN)
   */
  async updateReward(id, updateData) {
    return apiClient.put(`/api/rewards/${id}`, updateData);
  },

  /**
   * Soft-deactivate a reward (ADMIN)
   * Sets isActive=false, stock=0
   */
  async deleteReward(id) {
    return apiClient.delete(`/api/rewards/${id}`);
  },

  /**
   * All voucher redemptions platform-wide with user and reward details (ADMIN)
   * Supports ?status filter
   */
  async getAllRedemptions(params = {}) {
    return apiClient.get('/api/rewards/redemptions', params);
  },
};

export default rewardsService;
