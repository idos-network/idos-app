import axiosInstance from './axios';

export const getNoahOnRampUrl = async (
  userId: string,
  credentialId: string,
  address: string,
) => {
  const response = await axiosInstance
    .get(
      `/noah?userId=${userId}&credentialId=${credentialId}&address=${address}`,
    )
    .then((res) => res.data.url);
  return response;
};
