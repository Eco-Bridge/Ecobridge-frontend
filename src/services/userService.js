import apiClient from './apiClient';

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
  const raw = item?.user ?? item ?? {};
  const id = raw.id || raw._id || raw.userId || raw.uuid || `${index + 1}`;
  const name = raw.name || raw.fullName || `${raw.firstName || 'Citizen'} ${raw.lastName || ''}`.trim() || 'Unknown User';
  const email = raw.email || raw.userEmail || 'n/a';
  const phone = raw.phone || raw.phoneNumber || raw.mobile || 'n/a';
  const points = toNumber(raw.points ?? raw.pointsBalance ?? raw.rewardPoints ?? 0, 0);
  const balance = toNumber(raw.balance ?? raw.walletBalance ?? raw.points ?? raw.pointsBalance ?? points, 0);
  const joined = raw.createdAt || raw.joinedAt || raw.joined || 'N/A';
  const role = raw.role || 'USER';

  return {
    id,
    name,
    email,
    phone,
    points,
    balance,
    avatarInitials: raw.avatarInitials || (name || 'U').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'CU',
    role,
    type: raw.type || raw.userType || (role === 'ADMIN' ? 'Business' : 'Individual'),
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

  if (Array.isArray(response)) candidates.push(response);
  if (Array.isArray(response.users)) candidates.push(response.users);
  if (Array.isArray(response.results)) candidates.push(response.results);
  if (Array.isArray(response.data)) candidates.push(response.data);
  if (Array.isArray(response.data?.users)) candidates.push(response.data.users);
  if (Array.isArray(response.data?.results)) candidates.push(response.data.results);
  if (Array.isArray(response.items)) candidates.push(response.items);

  if (response.user && typeof response.user === 'object') candidates.push([response.user]);
  if (response.data && response.data.user && typeof response.data.user === 'object') candidates.push([response.data.user]);

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
  if (response.data && typeof response.data === 'object') {
    if (response.data.user) return toUserRecord(response.data.user);
    if (Array.isArray(response.data)) return normalizeUsers(response.data)[0] || null;
  }

  return toUserRecord(response);
}

export const userService = {
  async getUsers(query = '') {
    const searchText = (query || '').trim();
    const endpoint = searchText
      ? `/api/users?search=${encodeURIComponent(searchText)}`
      : '/api/users';

    const response = await apiClient.get(endpoint);
    return normalizeUsers(response);
  },

  async searchUsers(query = '') {
    return this.getUsers(query);
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
