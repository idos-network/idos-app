import type { Config, Context } from '@netlify/functions';
import { getUserTotalPoints } from '@/db/user';
import { InternalServerError, UserNotFoundError } from '@/utils/errors';

export default async (_request: Request, context: Context) => {
  const { userId } = context.params;

  try {
    if (!userId) {
      throw new UserNotFoundError(userId);
    }

    const totalPoints = await getUserTotalPoints(userId);
    return new Response(JSON.stringify({ totalPoints }), { status: 200 });
  } catch (error) {
    throw new InternalServerError(
      error instanceof Error ? error.message : 'Internal server error',
    );
  }
};

export const config: Config = {
  path: '/api/user/:userId/points',
  method: 'GET',
};
