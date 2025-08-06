import axiosInstance from './axios';
import { parseWithSchema } from './parser';
import { z } from 'zod';
import {
  userQuestSchema,
  userQuestSummarySchema,
  type UserQuest,
  type UserQuestSummary,
} from '@/interfaces/user-quests';

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
  const response = await axiosInstance.get(`/user-quests/${userId}`);
  return parseWithSchema(response.data, z.array(userQuestSchema));
};

export const getUserQuestsSummary = async (
  userId: string,
): Promise<UserQuestSummary[]> => {
  const response = await axiosInstance.get(`/user-quests/${userId}/summary`);
  return parseWithSchema(response.data, z.array(userQuestSummarySchema));
};
