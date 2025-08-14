import axiosInstance from './axios';

export const getTransakToken = async (
  credentialId: string,
): Promise<string> => {
  const response = await axiosInstance.get(
    `/transak-token?credentialId=${credentialId}`,
  );
  return response.data.token.token;
};
