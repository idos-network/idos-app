import axiosInstance from './axios';

export const getKrakenUrl = async (
  connectedWallet: string,
): Promise<string> => {
  const response = await axiosInstance.get(
    `/kraken-url?walletAddress=${connectedWallet}`,
  );
  return response.data.url;
};
