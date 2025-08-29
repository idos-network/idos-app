import { completeUserQuest, getUserQuests } from '@/db/user-quests';
import type { UserQuest } from '@/interfaces/user-quests';
import type { Config, Context } from '@netlify/functions';
import { z } from 'zod';
import { withAuth, type AuthenticatedRequest } from './middleware/auth';
import { handleDailyQuest } from './utils/quests';

const completeUserQuestRequestSchema = z.object({
  questName: z.string().min(1, 'questName is required'),
  userId: z.string().min(1, 'userId is required'),
});

async function completeUserQuestHandler(
  request: AuthenticatedRequest,
  _context: Context,
) {
  try {
    const requestBody = await request.json();
    const { questName, userId } =
      completeUserQuestRequestSchema.parse(requestBody);

    if (request.userId !== userId) {
      return new Response(
        JSON.stringify({
          error: 'Unauthorized to complete quest for another user',
        }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    const userQuests = (await getUserQuests(userId)) as UserQuest[];

    if (questName === 'daily_check') {
      if (!handleDailyQuest(userQuests)) {
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
}

export default withAuth(completeUserQuestHandler);

export const config: Config = {
  path: '/api/user-quests/complete',
  method: 'POST',
};
