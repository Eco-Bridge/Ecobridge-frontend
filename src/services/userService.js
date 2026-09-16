import apiClient from './apiClient';

const CITIZEN_ROLES = new Set(['USER', 'CITIZEN']);

function toNumber(value, fallback = 0) {
  const parsed = Number(value ?? fallback);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getUserStatus(user = {}) {
  const status = user.status || user.accountStatus || user.isActive;
  if (status === false || status === 'disabled' || status === 'inactive' || status === 'banned') return 'Disabled';
  if (status === true || status === 'active' || status === 'enabled') return 'Active';
  return 'Active';
}

function toUserRecord(item, index = 0) {
  const raw = item?.user ?? item?.citizen ?? item ?? {};
  const id = raw.id || raw._id || raw.userId || raw.citizenId || raw.uuid || `${index + 1}`;
  const rawName = raw.name || raw.fullName || raw.full_name || `${raw.firstName || raw.first_name || 'Citizen'} ${raw.lastName || raw.last_name || ''}`.trim();
  const name = rawName || 'Unknown User';
  const email = raw.email || raw.userEmail || raw.emailAddress || 'n/a';
  const phone = raw.phone || raw.phoneNumber || raw.mobile || raw.phone_number || 'n/a';
  const points = toNumber(raw.points ?? raw.pointsBalance ?? raw.rewardPoints ?? raw.ecoPoints ?? raw.eco_points ?? 0, 0);
  const balance = toNumber(raw.balance ?? raw.walletBalance ?? raw.wallet_balance ?? raw.points ?? raw.pointsBalance ?? points, 0);
  const joined = raw.createdAt || raw.created_at || raw.joinedAt || raw.joined || 'N/A';
  const role = String(raw.role || raw.userRole || 'USER').toUpperCase();

  return {
    id,
    name,
    email,
    phone,
    points,
    balance,
    avatarInitials: raw.avatarInitials || raw.avatar || (name || 'U').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'CU',
    role,
    type: raw.type || raw.userType || raw.accountType || (role === 'ADMIN' ? 'Business' : 'Individual'),
    status: getUserStatus(raw),
    joined,
    isActive: raw.isActive ?? raw.active ?? true,
  };
}

export function normalizeUsers(response) {
  if (!response || typeof response !== 'object') {
    return [];
  }

  const candidates = [];

  const pushIfArray = (value) => {
    if (Array.isArray(value)) candidates.push(value);
  };

  if (Array.isArray(response)) candidates.push(response);
  pushIfArray(response.users);
  pushIfArray(response.citizens);
  pushIfArray(response.members);
  pushIfArray(response.results);
  pushIfArray(response.items);
  pushIfArray(response.data);
  pushIfArray(response.data?.users);
  pushIfArray(response.data?.citizens);
  pushIfArray(response.data?.members);
  pushIfArray(response.data?.results);
  pushIfArray(response.data?.items);

  if (response.user && typeof response.user === 'object') candidates.push([response.user]);
  if (response.citizen && typeof response.citizen === 'object') candidates.push([response.citizen]);
  if (response.data && response.data.user && typeof response.data.user === 'object') candidates.push([response.data.user]);
  if (response.data && response.data.citizen && typeof response.data.citizen === 'object') candidates.push([response.data.citizen]);

  const possibleUsers = candidates.find((list) => Array.isArray(list) && list.length > 0) || [];

  if (possibleUsers.length === 0 && response.data && typeof response.data === 'object') {
    return normalizeUsers(response.data);
  }

  return possibleUsers.map((user, index) => toUserRecord(user, index));
}

export function normalizeUser(response) {
  if (!response || typeof response !== 'object') return null;

  if (Array.isArray(response)) return normalizeUsers(response)[0] || null;
  if (response.user && typeof response.user === 'object') return toUserRecord(response.user);
  if (response.citizen && typeof response.citizen === 'object') return toUserRecord(response.citizen);
  if (response.data && typeof response.data === 'object') {
    if (response.data.user) return toUserRecord(response.data.user);
    if (response.data.citizen) return toUserRecord(response.data.citizen);
    if (Array.isArray(response.data)) return normalizeUsers(response.data)[0] || null;
  }

  return toUserRecord(response);
}

const getSearchEndpoint = (searchText, path) => {
  const encoded = encodeURIComponent(searchText);
  if (!searchText) return path;
  return `${path}?search=${encoded}`;
};

export const userService = {
  async getUsers(query = '') {
    const searchText = (query || '').trim();
    const endpoints = [
      getSearchEndpoint(searchText, '/api/users'),
      getSearchEndpoint(searchText, '/api/users/search'),
      getSearchEndpoint(searchText, '/api/citizens'),
      getSearchEndpoint(searchText, '/api/citizens/search'),
    ];

    let lastError = null;

    for (const endpoint of endpoints) {
      try {
        const response = await apiClient.get(endpoint);
        const users = normalizeUsers(response);
        if (users.length > 0) return users;
      } catch (err) {
        lastError = err;
      }
    }

    if (lastError) {
      throw lastError;
    }

    return [];
  },

  async searchUsers(query = '') {
    const users = await this.getUsers(query);
    return users.filter((user) => CITIZEN_ROLES.has(String(user.role || '').toUpperCase()));
  },

  async getUserById(id) {
    if (!id) return null;
    const response = await apiClient.get(`/api/users/${encodeURIComponent(id)}`);
    return normalizeUser(response);
  },

  async updateUser(id, payload = {}) {
    if (!id) return null;
    return apiClient.put(`/api/users/${encodeURIComponent(id)}`, payload);
  },

  async updateUserStatus(id, status) {
    if (!id) return null;
    return apiClient.patch(`/api/users/${encodeURIComponent(id)}/status`, { status });
  },

  async deleteUser(id) {
    if (!id) return null;
    return apiClient.delete(`/api/users/${encodeURIComponent(id)}`);
  },
};

export default userService;
