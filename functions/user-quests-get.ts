import type { Config, Context } from '@netlify/functions';
import { getUserQuests } from '@/db/user-quests';
import { InternalServerError, UserNotFoundError } from '@/utils/errors';

export default async (_request: Request, context: Context) => {
  const { userId } = context.params;

  try {
    if (!userId) {
      throw new UserNotFoundError(userId);
    }

    const userQuests = await getUserQuests(userId);
    return new Response(JSON.stringify(userQuests), { status: 200 });
  } catch (error) {
    throw new InternalServerError(
      error instanceof Error ? error.message : 'Internal server error',
    );
  }
};

export const config: Config = {
  path: '/api/user-quests/:userId',
  method: 'GET',
};
