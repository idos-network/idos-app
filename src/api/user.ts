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
  const response = await axiosInstance.post('/api/user/save', userData);
  return response.data;
};

export const updateUser = async (userData: idOSUser): Promise<void> => {
  const response = await axiosInstance.post('/api/user/update', userData);
  return response.data;
};

export const getUserById = async (id: string): Promise<idOSUser[]> => {
  const response = await axiosInstance.get('/api/user', {
    params: { id },
  });
  return parseWithSchema(response.data, z.array(idOSUserResponseSchema));
};

export const getUserByReferralCode = async (
  referralCode: string,
): Promise<idOSUser[]> => {
  const response = await axiosInstance.get('/api/user', {
    params: { referralCode },
  });
  return parseWithSchema(response.data, z.array(idOSUserResponseSchema));
};

export const getUserTotalPoints = async (id: string): Promise<number> => {
  const response = await axiosInstance.get(`/api/user/${id}/points`);
  const parsed = parseWithSchema(
    response.data,
    z.object({ totalPoints: z.number() }),
  );
  return parsed.totalPoints;
};

export const getUserReferralCode = async (userId: string): Promise<string> => {
  const response = await axiosInstance.get('/api/user/referral-code', {
    params: { userId },
  });
  const parsed = parseWithSchema(
    response.data,
    z.object({ referralCode: z.string() }),
  );
  return parsed.referralCode;
};
