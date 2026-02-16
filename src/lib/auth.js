// Local storage key for JWT token
const TOKEN_KEY = 'authToken';
const USER_KEY = 'userId';
const ROLE_KEY = 'userRole';

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(ROLE_KEY);
}

export function isAuthenticated() {
  return !!getToken();
}

export function saveUser(userId, role) {
  localStorage.setItem(USER_KEY, userId);
  localStorage.setItem(ROLE_KEY, role);
}

export function getUser() {
  return {
    userId: localStorage.getItem(USER_KEY),
    role: localStorage.getItem(ROLE_KEY),
    username: localStorage.getItem(USER_KEY),
  };
}

export function isAdmin() {
  return localStorage.getItem(ROLE_KEY) === 'admin';
}

// helper to add auth header to fetch
export function getAuthHeaders() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}
