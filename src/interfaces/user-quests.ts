import { z } from 'zod';

export const userQuestSchema = z.object({
  id: z.number(),
  userId: z.string(),
  questName: z.string(),
  createdAt: z.coerce.date(),
});

export type UserQuest = z.infer<typeof userQuestSchema>;

export const userQuestSummarySchema = z.object({
  userId: z.string(),
  questName: z.string(),
  completionCount: z.number(),
  lastCompletedAt: z.coerce.date(),
  firstCompletedAt: z.coerce.date(),
});

export type UserQuestSummary = z.infer<typeof userQuestSummarySchema>;
