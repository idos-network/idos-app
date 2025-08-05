import type { Config, Context } from '@netlify/functions';
import { getUserTotalPoints } from '@/db/user';

export default async (_request: Request, context: Context) => {
  const { userId } = context.params;

  try {
    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), {
        status: 404,
      });
    }

    const totalPoints = await getUserTotalPoints(userId);
    return new Response(JSON.stringify({ totalPoints }), { status: 200 });
  } catch (error) {
    console.error('Get user points error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
};

export const config: Config = {
  path: '/api/user/:userId/points',
  method: 'GET',
};
