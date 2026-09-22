const API_BASE_URL = process.env.REACT_APP_API_URL;

export const TOKEN_KEY = 'ecobridge_token';
export const USER_KEY = 'ecobridge_user';

/**
 * Retrieve current JWT auth token
 */
export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Save auth token and user
 */
export function setStoredAuth(token, user) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

/**
 * Clear stored auth
 */
export function clearStoredAuth() {  
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * Retrieve cached user
 */
export function getStoredUser() {
  const user = localStorage.getItem(USER_KEY);
  if (!user) return null;
  try {
    return JSON.parse(user);
  } catch (err) {
    return null;
  }
}

/**
 * Core API request function
 */
export async function apiRequest(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const requestToken = getStoredToken();
  if (requestToken) {
    headers['Authorization'] = `Bearer ${requestToken}`;
  }

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);

    // Parse JSON or text response
    const contentType = response.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      // Extract error message from API response
      const errorMessage =
        (typeof data === 'object' && (data.message || data.error || data.msg)) ||
        (typeof data === 'string' && data) ||
        `Request failed with status ${response.status}`;

      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;

      // Token invalid or blacklisted
      if (response.status === 401 && !endpoint.includes('/auth/login')) {
        // Optional dispatch or custom event for auth expiration
        window.dispatchEvent(new CustomEvent('ecobridge:auth-expired', {
          detail: { token: requestToken },
        }));
      }

      throw error;
    }

    return data;
  } catch (err) {
    // Network or server down error
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      const networkError = new Error('Cannot connect to server. Please ensure the backend is running at ' + API_BASE_URL);
      networkError.status = 0;
      throw networkError;
    }
    throw err;
  }
}

export const apiClient = {
  get: (endpoint, params, headers) => {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value);
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString;
      }
    }
    return apiRequest(url, { method: 'GET', headers });
  },

  post: (endpoint, body, headers) => {
    return apiRequest(endpoint, { method: 'POST', body, headers });
  },

  put: (endpoint, body, headers) => {
    return apiRequest(endpoint, { method: 'PUT', body, headers });
  },

  patch: (endpoint, body, headers) => {
    return apiRequest(endpoint, { method: 'PATCH', body, headers });
  },

  delete: (endpoint, headers) => {
    return apiRequest(endpoint, { method: 'DELETE', headers });
  },
};

export default apiClient;
