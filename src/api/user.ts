import axiosInstance from './axios';
import type { idOSUser } from '@/db/user';
import { parseWithSchema } from './parser';
import { z } from 'zod';

const idOSUserResponseSchema = z.object({
  id: z.string(),
  mainEvm: z.string(),
  referralCode: z.string(),
  referralCount: z.number(),
  referrerCode: z.string(),
});

export const saveUser = async (userData: idOSUser): Promise<void> => {
  const response = await axiosInstance.post('/user/save', userData);
  return response.data;
};

export const updateUser = async (userData: idOSUser): Promise<void> => {
  const response = await axiosInstance.post('/user/update', userData);
  return response.data;
};

export const getUserById = async (userId: string): Promise<idOSUser[]> => {
  const response = await axiosInstance.get('/user', {
    params: { id: userId },
  });
  return parseWithSchema(response.data, z.array(idOSUserResponseSchema));
};

export const getUserByReferralCode = async (
  referralCode: string,
): Promise<idOSUser[]> => {
  const response = await axiosInstance.get('/user', {
    params: { referralCode },
  });
  return parseWithSchema(response.data, z.array(idOSUserResponseSchema));
};

export const getUserTotalPoints = async (id: string): Promise<number> => {
  const response = await axiosInstance.get(`/user/${id}/points`);
  const parsed = parseWithSchema(
    response.data,
    z.object({ totalPoints: z.number() }),
  );
  return parsed.totalPoints;
};

export const getUserReferralCode = async (userId: string): Promise<string> => {
  const response = await axiosInstance.get('/user', {
    params: { id: userId },
  });
  const users = parseWithSchema(response.data, z.array(idOSUserResponseSchema));

  if (users.length === 0) {
    throw new Error('User not found');
  }

  return users[0].referralCode;
};
