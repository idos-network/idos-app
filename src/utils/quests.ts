import { z } from 'zod';
import questsData from '../../quests.json';
import crypto from 'crypto';

export const questSchema = z.object({
  id: z.number(),
  name: z.string(),
  title: z.string(),
  description: z.string(),
  link: z.string(),
  pointsReward: z.number(),
  isActive: z.boolean(),
  isRepeatable: z.boolean(),
});

export type Quest = z.infer<typeof questSchema>;

export const questsConfig: readonly Quest[] = questsData;

export async function getActiveQuests(): Promise<Quest[]> {
  return questsConfig.filter((quest) => quest.isActive);
}

export async function getQuestByName(name: string): Promise<Quest | null> {
  return questsConfig.find((quest) => quest.name === name) || null;
}

export function generateReferralCode(userId: string, length = 8): string {
  const hash = crypto.createHash('sha256').update(userId).digest('hex');

  return hash.substring(0, length).toUpperCase();
}
