import { clearTokens, getAccessToken, getRefreshToken, setAccessToken, setRefreshToken } from '@/storage/auth';
import axios from 'axios';
import { refreshTokens } from './auth';

const axiosInstance = axios.create({
  baseURL: `${window.location.origin}/api`,
  timeout: 10000,
  withCredentials: true,
});

// Attach bearer token
axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshing: Promise<void> | null = null;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // If 401 and we haven't retried yet, try refresh
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      if (!refreshing) {
        refreshing = (async () => {
          const rt = getRefreshToken();
          if (!rt) throw new Error('No refresh token');
          const { token, refreshToken } = await refreshTokens(rt);
          setAccessToken(token);
          setRefreshToken(refreshToken);
        })().finally(() => {
          refreshing = null;
        });
      }

      try {
        await refreshing;
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${getAccessToken()}`;
        return axiosInstance.request(original);
      } catch (e) {
        clearTokens();
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
