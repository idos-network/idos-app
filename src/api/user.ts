import { idOSUserSchema, type IdOSUser } from '@/interfaces/user';
import { z } from 'zod';
import axiosInstance from './axios';
import { parseWithSchema } from './parser';

export const saveUserUnauth = async (userData: IdOSUser): Promise<void> => {
  const response = await axiosInstance.post('/user/save-unauth', userData);
  return response.data;
};

export const saveUser = async (userData: IdOSUser): Promise<void> => {
  const response = await axiosInstance.post('/user/save', userData);
  return response.data;
};

export const updateUser = async (userData: IdOSUser): Promise<void> => {
  const response = await axiosInstance.post('/user/update', userData);
  return response.data;
};

export const setUserName = async (userId: string): Promise<void> => {
  const response = await axiosInstance.post('/user/set-name', { userId });
  return response.data;
};

export const getUserById = async (userId: string): Promise<IdOSUser[]> => {
  const response = await axiosInstance.get(`/user/${userId}`);
  return parseWithSchema(response.data, z.array(idOSUserSchema));
};

export const getUserPoints = async (
  id: string,
): Promise<{
  questPoints: number;
  socialPoints: number;
  contributionPoints: number;
  totalPoints: number;
}> => {
  const response = await axiosInstance.get(`/user/${id}/points`);
  return parseWithSchema(
    response.data,
    z.object({
      questPoints: z.number(),
      socialPoints: z.number(),
      contributionPoints: z.number(),
      totalPoints: z.number(),
    }),
  );
};

export const getUserReferralCount = async (userId: string): Promise<number> => {
  const response = await axiosInstance.get(`/user/${userId}/referral-count`);
  return parseWithSchema(response.data, z.number());
};
