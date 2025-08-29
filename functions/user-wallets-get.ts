import { getUserWallets } from '@/db/user-wallets';
import { UserNotFoundError } from '@/utils/errors';
import type { Config, Context } from '@netlify/functions';
import { withAuth, type AuthenticatedRequest } from './middleware/auth';

async function getUserWalletsHandler(
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
        error: 'Unauthorized to get wallets for another user',
      }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }

  try {
    const wallets = await getUserWallets(userId);
    return new Response(JSON.stringify(wallets), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in user-wallets-get:', error);
    throw error;
  }
}

export default withAuth(getUserWalletsHandler);

export const config: Config = {
  path: '/api/user-wallets/:userId',
  method: 'GET',
};
