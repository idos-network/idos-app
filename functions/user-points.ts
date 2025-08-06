import type { Config, Context } from '@netlify/functions';
import { getUserTotalPoints } from '@/db/user';
import { UserNotFoundError } from '@/utils/errors';

export default async (_request: Request, context: Context) => {
  const { userId } = context.params;

  if (!userId) {
    throw new UserNotFoundError(userId);
  }

  try {
    const totalPoints = await getUserTotalPoints(userId);
    return new Response(JSON.stringify({ totalPoints }), { status: 200 });
  } catch (error) {
    console.error('Error in user-points:', error);
    throw error;
  }
};

export const config: Config = {
  path: '/api/user/:userId/points',
  method: 'GET',
};
