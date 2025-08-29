import axiosInstance from './axios';

export const getGeoblock = async () => {
  const response = await axiosInstance.get(`/geoblock`);
  return response.data;
};
