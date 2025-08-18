import { idOSUserSchema, type IdOSUser } from '@/interfaces/user';
import { z } from 'zod';
import axiosInstance from './axios';
import { parseWithSchema } from './parser';

export const saveUser = async (userData: IdOSUser): Promise<void> => {
  const response = await axiosInstance.post('/user/save', userData);
  return response.data;
};

export const updateUser = async (userData: IdOSUser): Promise<void> => {
  const response = await axiosInstance.post('/user/update', userData);
  return response.data;
};

export const getUserById = async (userId: string): Promise<IdOSUser[]> => {
  const response = await axiosInstance.get(`/user/${userId}`);
  return parseWithSchema(response.data, z.array(idOSUserSchema));
};

export const getUserTotalPoints = async (id: string): Promise<number> => {
  const response = await axiosInstance.get(`/user/${id}/points`);
  const parsed = parseWithSchema(
    response.data,
    z.object({ totalPoints: z.number() }),
  );
  return parsed.totalPoints;
};

export const getUserReferralCount = async (
  referralCode: string,
): Promise<number> => {
  const response = await axiosInstance.get(
    `/user/${referralCode}/referral-count`,
  );
  return parseWithSchema(response.data, z.number());
};
