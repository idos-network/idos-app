import axiosInstance from './axios';
import type { UserQuest, UserQuestSummary } from '@/db/user-quests';
import { parseWithSchema } from './parser';
import { z } from 'zod';

const userQuestResponseSchema = z.object({
  id: z.number().optional(),
  userId: z.string(),
  questName: z.string(),
  completedAt: z.coerce.date(),
});

const userQuestSummaryResponseSchema = z.object({
  userId: z.string(),
  questName: z.string(),
  completionCount: z.number(),
  lastCompletedAt: z.coerce.date(),
  firstCompletedAt: z.coerce.date(),
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

export const getUserQuestsSummary = async (
  userId: string,
): Promise<UserQuestSummary[]> => {
  const response = await axiosInstance.get('/user-quests/summary', {
    params: { userId },
  });
  return parseWithSchema(
    response.data,
    z.array(userQuestSummaryResponseSchema),
  );
};
