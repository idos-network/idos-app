import axiosInstance from './axios';

export const getSharedCredential = async (userId: string) => {
  const response = await axiosInstance.get(
    `/get-shared-credential?userId=${userId}`,
  );
  return response.data;
};
