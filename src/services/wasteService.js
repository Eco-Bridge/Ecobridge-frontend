import apiClient from './apiClient';

export const DEFAULT_RATES = {
  E_WASTE: 25,
  CANS_METAL: 15,
  PLASTIC: 10,
  PAPER_CARDBOARD: 5,
  GLASS: 4,
  OTHER: 3,
};

/**
 * Environmental impact calculation formulas as defined in EcoBridge specifications:
 * - CO2 Saved (kg): weight_kg * 1.85 (~1.85 kg of CO2 prevented per 1 kg recycled)
 * - Trees Equivalent: co2_saved / 21.77 (~21.77 kg CO2 absorbed per urban tree/year)
 * - Water Saved (liters): weight_kg * 120 (~120 L of water saved per kg recycled)
 */
export function calculateEnvironmentalImpact(weightKg) {
  const kg = parseFloat(weightKg) || 0;
  const co2Saved = Number((kg * 1.85).toFixed(2));
  const treesEquivalent = Number((co2Saved / 21.77).toFixed(2));
  const waterSavedLiters = Number((kg * 120).toFixed(1));

  return {
    co2Saved,
    treesEquivalent,
    waterSavedLiters,
  };
}

export const wasteService = {
  /**
   * Get eco-points conversion rate card per waste type (Public)
   */
  async getRates() {
    try {
      return await apiClient.get('/api/waste/rates');
    } catch (err) {
      // Return fallback rates if server isn't serving rates yet
      return DEFAULT_RATES;
    }
  },

  /**
   * Record a citizen waste drop-off by userId or userEmail (COLLECTOR / ADMIN)
   * Auto-calculates points & atomically updates user balances.
   */
  async recordWaste({ userId, userEmail, wasteType, weightKg, note, notes }) {
    return apiClient.post('/api/waste/record', {
      userId,
      userEmail,
      wasteType,
      weightKg: parseFloat(weightKg),
      notes: note || notes,
    });
  },

  /**
   * Paginated recycling history for the logged-in citizen (Bearer protected)
   * Supports ?wasteType, ?page, ?limit
   */
  async getMyHistory(params = {}) {
    return apiClient.get('/api/waste/my-history', params);
  },

  /**
   * All platform submissions (ADMIN / COLLECTOR)
   * Supports ?wasteType, ?userId, ?page, ?limit
   */
  async getAllWaste(params = {}) {
    return apiClient.get('/api/waste/all', params);
  },

  /**
   * Single recycling record detail including citizen info and staff who recorded it (Owner or Staff)
   */
  async getWasteById(id) {
    return apiClient.get(`/api/waste/${id}`);
  },
};

export default wasteService;
