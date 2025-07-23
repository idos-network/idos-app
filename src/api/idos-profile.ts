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
  const response = await axiosInstance.post('/idosprofile', {
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

export const verifyRecaptcha = async (token: string) => {
  const response = await axiosInstance.post('/recaptcha', { token });
  return response.data;
};
