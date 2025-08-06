import type { Config, Context } from '@netlify/functions';
import { getUserQuestsSummary } from '@/db/user-quests';
import { UserNotFoundError } from '@/utils/errors';

export default async (_request: Request, context: Context) => {
  const { userId } = context.params;

  if (!userId) {
    throw new UserNotFoundError(userId);
  }

  try {
    const userQuestsSummary = await getUserQuestsSummary(userId);
    return new Response(JSON.stringify(userQuestsSummary), { status: 200 });
  } catch (error) {
    console.error('Error in user-quests-summary:', error);
    throw error;
  }
};

export const config: Config = {
  path: '/api/user-quests/:userId/summary',
  method: 'GET',
};
