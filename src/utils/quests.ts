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
  iframe: z.optional(z.string()),
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
