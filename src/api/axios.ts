import { authService } from '@/services/auth';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: `${window.location.origin}/api`,
  timeout: 10000,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = authService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newTokens = await authService.refreshTokens();

        if (newTokens) {
          authService.saveTokensToStorage(newTokens);
          originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        authService.logout();
        console.error('Token refresh failed:', refreshError);
      }
    }

    if (error.response) {
      const { status } = error.response;
      console.error('Response error status:', status);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
