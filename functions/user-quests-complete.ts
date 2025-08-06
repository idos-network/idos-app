import type { Config, Context } from '@netlify/functions';
import { completeUserQuest } from '@/db/user-quests';
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
