import axiosInstance from './axios';
import type { Quest } from '@/db/quests';
import { questSchema } from '@/db/quests';
import { parseWithSchema } from './parser';
import { z } from 'zod';

export const getActiveQuests = async (): Promise<Quest[]> => {
  const response = await axiosInstance.get('/quests');
  return parseWithSchema(response.data, z.array(questSchema));
};

export const getQuestByName = async (name: string): Promise<Quest | null> => {
  const response = await axiosInstance.get(`/quests/${name}`);
  return parseWithSchema(response.data, questSchema.nullable());
};
