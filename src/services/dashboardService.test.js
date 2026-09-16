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

  it('supports the new admin dashboard response shape from the backend', () => {
    const payload = {
      success: true,
      data: {
        overview: {
          totalCitizens: 120,
          totalRewardsIssued: 45,
          wasteCollectedKg: 2450.5,
          revenue: 0,
          totalCollections: 230,
        },
        wasteCollectedMonthly: [
          { month: 'Jan 2026', totalWeightKg: 410.2 },
        ],
        wasteBreakdown: [
          { wasteType: 'PLASTIC', totalWeightKg: 1200, collectionsCount: 50 },
        ],
        recentCollections: [
          {
            id: 8,
            wasteType: 'PLASTIC',
            weightKg: 12.5,
            pointsEarned: 125,
            location: '...',
            user: { name: 'Jane' },
          },
        ],
        topLagosRecyclers: [
          { name: 'Jane', totalWeightKg: 320.4, address: 'Lagos' },
        ],
      },
    };

    expect(normalizeAdminDashboardPayload(payload)).toMatchObject({
      totalUsers: 120,
      rewardsIssuedCount: 45,
      totalWeightKg: 2450.5,
      totalRevenue: 0,
      monthlyWaste: [{ month: 'Jan 2026', kg: 410.2 }],
      wasteCategoryBreakdown: [{ name: 'PLASTIC', value: 1200 }],
      recentCollections: [{ user: 'Jane', weightKg: 12.5 }],
      topLagosRecyclers: [{ name: 'Jane', totalWeightKg: 320.4 }],
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
