import apiClient from './apiClient';

const DASHBOARD_KEYS = new Set([
  'totalUsers',
  'usersCount',
  'totalWeightKg',
  'allTimeWeightKg',
  'totalWasteKg',
  'rewardsIssuedCount',
  'rewardsIssued',
  'totalRevenue',
  'users',
  'recentCollections',
  'recentFeed',
  'categoryBreakdown',
  'wasteByCategory',
  'monthlyWaste',
  'monthlyCollections',
  'stats',
  'dashboard',
]);

function hasDashboardShape(obj) {
  if (!obj || typeof obj !== 'object') return false;
  return Object.keys(obj).some((key) => DASHBOARD_KEYS.has(key));
}

export function normalizeDashboardPayload(payload) {
  if (!payload || typeof payload !== 'object') return payload;

  const queue = [payload];
  const candidates = [];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || typeof current !== 'object') continue;
    if (hasDashboardShape(current)) {
      candidates.push(current);
    }

    if (current.data && typeof current.data === 'object') queue.push(current.data);
    if (current.dashboard && typeof current.dashboard === 'object') queue.push(current.dashboard);
    if (current.stats && typeof current.stats === 'object') queue.push(current.stats);
    if (current.summary && typeof current.summary === 'object') queue.push(current.summary);
    if (current.overview && typeof current.overview === 'object') queue.push(current.overview);
  }

  if (candidates.length > 0) {
    return candidates[candidates.length - 1];
  }

  return payload.data ?? payload;
}

function pickFirstDefined(...values) {
  for (const value of values) {
    if (value !== undefined && value !== null) return value;
  }
  return undefined;
}

export function normalizeAdminDashboardPayload(payload) {
  const normalized = normalizeDashboardPayload(payload);
  if (!normalized || typeof normalized !== 'object') return normalized;

  const source = normalized.data && typeof normalized.data === 'object' ? normalized.data : normalized;
  const overview = source.overview && typeof source.overview === 'object' ? source.overview : source;

  const usersByRole = pickFirstDefined(source.usersByRole, overview.usersByRole, []);
  const citizenCount = Array.isArray(usersByRole)
    ? usersByRole.reduce((sum, item) => {
        const role = String(item?.role || '').toUpperCase();
        if (role === 'CITIZEN') {
          return sum + Number(item?.count ?? item?.total ?? item?.value ?? 0);
        }
        return sum;
      }, 0)
    : 0;

  const dashboard = {
    ...source,
    ...overview,
    usersByRole,
    totalUsers: pickFirstDefined(
      overview.totalUsers,
      source.totalUsers,
      citizenCount > 0 ? citizenCount : overview.totalCitizens,
      overview.totalCitizens,
      source.totalCitizens,
      citizenCount || 0
    ),
    wasteCategoryBreakdown: pickFirstDefined(
      source.wasteCategoryBreakdown,
      overview.wasteCategoryBreakdown,
      source.categoryBreakdown,
      overview.categoryBreakdown,
      []
    ),
    monthlyWaste: pickFirstDefined(
      source.monthlyWaste,
      overview.monthlyWaste,
      source.monthlyCollections,
      overview.monthlyCollections,
      []
    ),
    environmentalImpact: pickFirstDefined(source.environmentalImpact, overview.environmentalImpact, {}),
    recentCollections: pickFirstDefined(
      source.recentCollections,
      overview.recentCollections,
      source.recentFeed,
      overview.recentFeed,
      []
    ),
    rewardsIssuedCount: pickFirstDefined(
      source.rewardsIssuedCount,
      overview.rewardsIssuedCount,
      source.totalRewardsIssued,
      overview.totalRewardsIssued,
      source.totalRewardsRedeemed,
      overview.totalRewardsRedeemed,
      0
    ),
    totalRevenue: pickFirstDefined(
      source.totalRevenue,
      overview.totalRevenue,
      source.totalRevenueGenerated,
      overview.totalRevenueGenerated,
      source.revenue,
      overview.revenue,
      0
    ),
    totalWeightKg: pickFirstDefined(
      source.totalWeightKg,
      overview.totalWeightKg,
      source.totalWasteKg,
      overview.totalWasteKg,
      source.allTimeWeightKg,
      overview.allTimeWeightKg,
      0
    ),
    overview,
  };

  return dashboard;
}

export const dashboardService = {
  /**
   * Citizen dashboard: points balance, kg recycled, environmental impact (CO2, trees, water), recent history, active vouchers. (Bearer protected)
   */
  async getUserDashboard() {
    const response = await apiClient.get('/api/dashboard/user');
    return normalizeDashboardPayload(response);
  },

  /**
   * Alias for /api/dashboard/user
   */
  async getMyDashboard() {
    const response = await apiClient.get('/api/dashboard/me');
    return normalizeDashboardPayload(response);
  },

  /**
   * Platform analytics: total users by role, all-time weight & points, category breakdown, recent collection feed. (ADMIN / COLLECTOR)
   */
  async getAdminDashboard() {
    const response = await apiClient.get('/api/dashboard/admin');
    return normalizeAdminDashboardPayload(response);
  },
};

export default dashboardService;
