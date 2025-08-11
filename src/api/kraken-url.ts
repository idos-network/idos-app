import axiosInstance from './axios';

export const getKrakenUrl = async (): Promise<string> => {
  const response = await axiosInstance.get('/kraken-url');
  return response.data.url;
};
