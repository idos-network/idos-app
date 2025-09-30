import axiosInstance from './axios';

export const getDwgConfiguration = async (): Promise<{
  time: number;
  publicKey: string;
}> => {
  const response = await axiosInstance.get('/idos-dwg');
  return response.data;
};
