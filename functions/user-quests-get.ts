import { getUserQuests } from '@/db/user-quests';
import { UserNotFoundError } from '@/utils/errors';
import type { Config, Context } from '@netlify/functions';
import { withAuth, type AuthenticatedRequest } from './middleware/auth';

async function getUserQuestsHandler(
  request: AuthenticatedRequest,
  context: Context,
) {
  const { userId } = context.params;

  if (!userId) {
    throw new UserNotFoundError(userId);
  }

  if (request.userId !== userId) {
    return new Response(
      JSON.stringify({
        error: 'Unauthorized to get quests for another user',
      }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }

  try {
    const userQuests = await getUserQuests(userId);
    return new Response(JSON.stringify(userQuests), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in user-quests-get:', error);
    throw error;
  }
}

export default withAuth(getUserQuestsHandler);

export const config: Config = {
  path: '/api/user-quests/:userId',
  method: 'GET',
};
