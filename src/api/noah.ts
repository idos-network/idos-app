import axiosInstance from './axios';

export const getNoahCustomer = async (
  userId: string,
  credentialId: string,
  address: string,
) => {
  const response = await axiosInstance.get(
    `/noah?userId=${userId}&credentialId=${credentialId}&address=${address}`,
  );
  return response.data;
};
