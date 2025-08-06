import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: `${window.location.origin}/api`,
  timeout: 10000,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response) {
      const { status } = error.response;
      console.error('Response error status:', status);
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
