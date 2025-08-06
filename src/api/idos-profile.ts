import axiosInstance from './axios';

export const createIdOSProfile = async (
  userId?: string,
  userEncryptionPublicKey?: string,
  address?: string,
  ownershipProofMessage?: string,
  ownershipProofSignature?: string,
  publicKey?: string,
  walletType?: string,
) => {
  const response = await axiosInstance.post('/idos-profile', {
    userId,
    userEncryptionPublicKey,
    address,
    ownershipProofMessage,
    ownershipProofSignature,
    publicKey,
    walletType,
  });
  return response.data;
};
