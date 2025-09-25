import axiosInstance from './axios';
import { type IdosDWG } from '@/interfaces/idos-credential';

export const createIdOSCredential = async (
  idOSDWG: IdosDWG,
  userEncryptionPublicKey: string,
  userId: string,
) => {
  const response = await axiosInstance.post('/idos-credential', {
    idOSDWG,
    userEncryptionPublicKey,
    userId,
  });
  return response.data;
};

export const clearIdOSCredential = async (userId: string) => {
  const response = await axiosInstance.post('/idos-credential/clear', {
    userId,
  });
  return response.data as { success: boolean };
};
