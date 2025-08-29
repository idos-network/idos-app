import { getUserTotalPoints } from '@/db/user';
import { UserNotFoundError } from '@/utils/errors';
import type { Config, Context } from '@netlify/functions';
import { withAuth, type AuthenticatedRequest } from './middleware/auth';

async function getUserPointsHandler(
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
        error: 'Unauthorized to get points for another user',
      }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }

  try {
    const totalPoints = await getUserTotalPoints(userId);
    return new Response(JSON.stringify({ totalPoints }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in user-points:', error);
    throw error;
  }
}

export default withAuth(getUserPointsHandler);

export const config: Config = {
  path: '/api/user/:userId/points',
  method: 'GET',
};
