import type { Config, Context } from '@netlify/functions';
import { getUserQuests } from '@/db/user-quests';
import { UserNotFoundError } from '@/utils/errors';

export default async (_request: Request, context: Context) => {
  const { userId } = context.params;

  if (!userId) {
    throw new UserNotFoundError(userId);
  }

  try {
    const userQuests = await getUserQuests(userId);
    return new Response(JSON.stringify(userQuests), { status: 200 });
  } catch (error) {
    console.error('Error in user-quests-get:', error);
    throw error;
  }
};

export const config: Config = {
  path: '/api/user-quests/:userId',
  method: 'GET',
};
