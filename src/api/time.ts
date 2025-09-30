import axiosInstance from './axios';

export const getTime = async () => {
  const response = await axiosInstance.get('/time');
  return response.data;
};
