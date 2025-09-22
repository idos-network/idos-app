import { getUserPoints } from '@/db/user';
import { UserNotFoundError } from '@/utils/errors';
import type { Config, Context } from '@netlify/functions';

export default async (_request: Request, context: Context) => {
  const { userId } = context.params;

  if (!userId) {
    throw new UserNotFoundError(userId);
  }

  try {
    const points = await getUserPoints(userId);
    return new Response(JSON.stringify(points), { status: 200 });
  } catch (error) {
    console.error('Error in user-points:', error);
    throw error;
  }
};

export const config: Config = {
  path: '/api/user/:userId/points',
  method: 'GET',
};
