import axiosInstance from './axios';
import { type IdosDWG } from '@/interfaces/idos-credential';

export const createIdOSCredential = async (
  idOSDWG: IdosDWG,
  userEncryptionPublicKey: string,
  userId: string,
) => {
  const response = await axiosInstance.post('/idoscredential', {
    idOSDWG,
    userEncryptionPublicKey,
    userId,
  });
  return response.data;
};
