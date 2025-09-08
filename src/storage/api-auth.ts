const ACCESS_KEY = 'idos.accessToken';
const REFRESH_KEY = 'idos.refreshToken';

export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY) || '';
}

export function setAccessToken(token: string) {
  if (token) localStorage.setItem(ACCESS_KEY, token);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY) || '';
}

export function setRefreshToken(token: string) {
  if (token) localStorage.setItem(REFRESH_KEY, token);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}