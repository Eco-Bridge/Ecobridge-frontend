import { normalizeAdminDashboardPayload } from './dashboardService';

describe('normalizeAdminDashboardPayload', () => {
  it('flattens nested backend payloads into the dashboard fields the UI expects', () => {
    const payload = {
      success: true,
      data: {
        totalUsers: 128,
        totalWeightKg: 5400,
        rewardsIssuedCount: 340,
        monthlyWaste: [
          { month: 'Jan', kg: 200 },
          { month: 'Feb', kg: 300 },
        ],
        categoryBreakdown: {
          PLASTIC: 60,
          GLASS: 40,
        },
        recentCollections: [
          { user: 'Ayo', weightKg: 12, createdAt: '2026-09-01T00:00:00Z' },
        ],
      },
    };

    expect(normalizeAdminDashboardPayload(payload)).toMatchObject({
      totalUsers: 128,
      totalWeightKg: 5400,
      rewardsIssuedCount: 340,
      monthlyWaste: [
        { month: 'Jan', kg: 200 },
        { month: 'Feb', kg: 300 },
      ],
      categoryBreakdown: { PLASTIC: 60, GLASS: 40 },
      recentCollections: [{ user: 'Ayo', weightKg: 12 }],
    });
  });

  it('reads the real nested overview payload used by the backend dashboard', () => {
    const payload = {
      success: true,
      data: {
        overview: {
          totalUsers: 128,
          totalWeightKg: 5400,
          rewardsIssuedCount: 340,
          monthlyWaste: [
            { month: 'Jan', kg: 200 },
            { month: 'Feb', kg: 300 },
          ],
          wasteCategoryBreakdown: [{ category: 'PET Plastic', value: 60 }],
          recentCollections: [{ user: 'Ayo', weightKg: 12, createdAt: '2026-09-01T00:00:00Z' }],
        },
      },
    };

    expect(normalizeAdminDashboardPayload(payload)).toMatchObject({
      totalUsers: 128,
      totalWeightKg: 5400,
      rewardsIssuedCount: 340,
      monthlyWaste: [
        { month: 'Jan', kg: 200 },
        { month: 'Feb', kg: 300 },
      ],
      wasteCategoryBreakdown: [{ category: 'PET Plastic', value: 60 }],
      recentCollections: [{ user: 'Ayo', weightKg: 12 }],
    });
  });

  it('filters the total user count to citizens only when role data is present', () => {
    const payload = {
      totalUsers: 500,
      usersByRole: [
        { role: 'CITIZEN', count: 420 },
        { role: 'ADMIN', count: 12 },
        { role: 'COLLECTOR', count: 68 },
      ],
      totalWeightKg: 5400,
      totalRewardsIssued: 340,
      totalRevenueGenerated: 1380000,
    };

    expect(normalizeAdminDashboardPayload(payload)).toMatchObject({
      totalUsers: 420,
      totalWeightKg: 5400,
      rewardsIssuedCount: 340,
      totalRevenue: 1380000,
    });
  });

  it('accepts already-normalized payloads and adds the expected dashboard keys', () => {
    const payload = {
      totalUsers: 45,
      totalWeightKg: 1200,
      rewardsIssuedCount: 99,
    };

    expect(normalizeAdminDashboardPayload(payload)).toMatchObject({
      totalUsers: 45,
      totalWeightKg: 1200,
      rewardsIssuedCount: 99,
      usersByRole: [],
      wasteCategoryBreakdown: [],
      monthlyWaste: [],
      recentCollections: [],
    });
  });
});
