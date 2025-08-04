import axiosInstance from './axios';
import type { UserQuest } from '@/db/user-quests';
import { parseWithSchema } from './parser';
import { z } from 'zod';

const userQuestResponseSchema = z.object({
  id: z.number().optional(),
  userId: z.string(),
  questName: z.string(),
  completionCount: z.number(),
  lastCompletedAt: z.date().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const completeUserQuest = async (
  userId: string,
  questName: string,
): Promise<void> => {
  const response = await axiosInstance.post('/user-quests/complete', {
    questName,
    userId,
  });
  return response.data;
};

export const getUserQuests = async (userId: string): Promise<UserQuest[]> => {
  const response = await axiosInstance.get('/user-quests', {
    params: { userId },
  });
  return parseWithSchema(response.data, z.array(userQuestResponseSchema));
};

export const getUserQuestById = async (
  userId: string,
  id: number,
): Promise<UserQuest[]> => {
  const response = await axiosInstance.get('/user-quests', {
    params: { userId, id },
  });
  return parseWithSchema(response.data, z.array(userQuestResponseSchema));
};
