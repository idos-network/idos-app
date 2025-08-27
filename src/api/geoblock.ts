import axiosInstance from './axios';

export const getIpData = async () => {
  const response = await axiosInstance.get(`/geoblock`);
  return response.data;
};
