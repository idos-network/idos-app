import { completeUserQuest, getUserQuests } from '@/db/user-quests';
import type { Config, Context } from '@netlify/functions';
import { z } from 'zod';

const completeUserQuestRequestSchema = z.object({
  questName: z.string().min(1, 'questName is required'),
  userId: z.string().min(1, 'userId is required'),
});

export default async (request: Request, _context: Context) => {
  try {
    const requestBody = await request.json();
    const { questName, userId } =
      completeUserQuestRequestSchema.parse(requestBody);

    if (questName === 'daily_check') {
      const userQuests = await getUserQuests(userId);
      const lastCompleted = userQuests.find(
        (quest) => quest.questName === 'daily_check',
      );
      if (
        lastCompleted?.updatedAt &&
        lastCompleted.updatedAt > new Date(Date.now() - 24 * 60 * 60 * 1000)
      ) {
        throw null;
      }
    }
    const result = await completeUserQuest(userId, questName);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in user-quests-complete:', error);
    throw error;
  }
};

export const config: Config = {
  path: '/api/user-quests/complete',
  method: 'POST',
};
