import { getUserQuests } from '@/api/user-quests';
import crypto from 'crypto';
import { z } from 'zod';
import questsData from '../../quests.json';

export const questSchema = z.object({
  id: z.number(),
  name: z.string(),
  title: z.string(),
  description: z.string(),
  link: z.string(),
  internal: z.boolean(),
  buttonText: z.string(),
  pointsReward: z.number(),
  isActive: z.boolean(),
  isRepeatable: z.boolean(),
});

export type Quest = z.infer<typeof questSchema>;

export const questsConfig: readonly Quest[] = questsData;

export function getActiveQuests(): Quest[] {
  return questsConfig.filter((quest) => quest.isActive);
}

export function getQuestByName(name: string): Quest | null {
  return questsConfig.find((quest) => quest.name === name) || null;
}

export function generateReferralCode(userId: string, length = 8): string {
  const hash = crypto.createHash('sha256').update(userId).digest('hex');

  return hash.substring(0, length).toUpperCase();
}

export async function getDailyQuestTimeRemaining(
  userId: string,
): Promise<number> {
  if (!userId) return 0;

  const quests = await getUserQuests(userId);
  const lastCompleted = quests
    .filter((quest) => quest.questName === 'daily_check')
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())[0];

  if (!lastCompleted) {
    return 0;
  }

  const now = new Date();
  const today = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
  const lastCompletedUTC = new Date(
    Date.UTC(
      lastCompleted.updatedAt.getUTCFullYear(),
      lastCompleted.updatedAt.getUTCMonth(),
      lastCompleted.updatedAt.getUTCDate(),
    ),
  );

  if (
    lastCompletedUTC.getTime() !== today.getTime() &&
    lastCompletedUTC.getTime() < today.getTime()
  ) {
    return 0;
  }

  const endOfDayUTC = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1),
  );

  const timeRemaining = endOfDayUTC.getTime() - now.getTime();

  return timeRemaining > 0 ? timeRemaining : 0;
}
