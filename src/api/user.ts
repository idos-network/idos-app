import axiosInstance from './axios';
import type { IdOSUser } from '@/db/user';
import { parseWithSchema } from './parser';
import { z } from 'zod';

const idOSUserResponseSchema = z.object({
  id: z.string(),
  mainEvm: z.string(),
  referrerCode: z.string().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const saveUser = async (userData: IdOSUser): Promise<void> => {
  const response = await axiosInstance.post('/user/save', userData);
  return response.data;
};

export const updateUser = async (userData: IdOSUser): Promise<void> => {
  const response = await axiosInstance.post('/user/update', userData);
  return response.data;
};

export const getUserById = async (userId: string): Promise<IdOSUser[]> => {
  const response = await axiosInstance.get('/user', {
    params: { id: userId },
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
