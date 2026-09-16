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

  const monthlyWaste = pickFirstDefined(
    source.monthlyWaste,
    overview.monthlyWaste,
    source.wasteCollectedMonthly,
    overview.wasteCollectedMonthly,
    source.monthlyCollections,
    overview.monthlyCollections,
    []
  );

  const wasteCategoryBreakdown = pickFirstDefined(
    source.wasteCategoryBreakdown,
    overview.wasteCategoryBreakdown,
    source.wasteBreakdown,
    overview.wasteBreakdown,
    source.categoryBreakdown,
    overview.categoryBreakdown,
    []
  );

  const recentCollections = pickFirstDefined(
    source.recentCollections,
    overview.recentCollections,
    source.recentFeed,
    overview.recentFeed,
    []
  );

  const normalizedMonthlyWaste = Array.isArray(monthlyWaste)
    ? monthlyWaste.map((item) => ({
        month: item.month || item.label || item.name || 'Unknown',
        kg: Number(item.kg ?? item.totalWeightKg ?? item.weightKg ?? item.value ?? item.amount ?? 0),
      }))
    : [];

  const normalizedBreakdown = Array.isArray(wasteCategoryBreakdown)
    ? wasteCategoryBreakdown.map((item, index) => ({
        name: item.name || item.wasteType || item.category || item.label || `Category ${index + 1}`,
        value: Number(item.value ?? item.totalWeightKg ?? item.weightKg ?? item.percent ?? item.count ?? 0),
        color: item.color || ['#0D631B', '#4ADE80', '#1A1A2E', '#3B82F6'][index % 4],
      }))
    : [];

  const normalizedRecentCollections = Array.isArray(recentCollections)
    ? recentCollections.map((row, index) => ({
        user: row.user?.name || row.userName || row.userEmail || row.name || row.user || `Citizen ${index + 1}`,
        material: row.material || row.wasteType || row.category || row.type || 'PLASTIC',
        weight: row.weight || row.weightKg || row.amountKg ? `${row.weight ?? row.weightKg ?? row.amountKg} kg` : '0 kg',
        weightKg: Number(row.weightKg ?? row.weight ?? row.amountKg ?? 0),
        date: row.createdAt || row.date || row.recordedAt || 'Today',
        verified: row.verified ?? true,
      }))
    : [];

  const dashboard = {
    ...source,
    ...overview,
    usersByRole,
    totalUsers: pickFirstDefined(
      overview.totalUsers,
      source.totalUsers,
      overview.totalCitizens,
      source.totalCitizens,
      citizenCount > 0 ? citizenCount : 0,
      0
    ),
    wasteCategoryBreakdown: normalizedBreakdown,
    monthlyWaste: normalizedMonthlyWaste,
    environmentalImpact: pickFirstDefined(source.environmentalImpact, overview.environmentalImpact, {}),
    recentCollections: normalizedRecentCollections,
    topLagosRecyclers: pickFirstDefined(source.topLagosRecyclers, overview.topLagosRecyclers, []),
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
      source.wasteCollectedKg,
      overview.wasteCollectedKg,
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
