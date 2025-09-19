import { getUserReferralCount } from '@/db/user';
import { ValidationError } from '@/utils/errors';
import { generateReferralCode } from '@/utils/quests';
import type { Config, Context } from '@netlify/functions';
import { withAuth, type AuthenticatedRequest } from './middleware/auth';

async function getUserReferralCountHandler(
  request: AuthenticatedRequest,
  context: Context,
) {
  const { userId } = context.params;

  if (!userId) {
    throw new ValidationError('Referral code is required');
  }

  if (request.userId !== userId) {
    return new Response(
      JSON.stringify({
        error: 'Unauthorized to view referral count for another user',
      }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }

  try {
    const count = await getUserReferralCount(
      generateReferralCode(request.userId),
    );
    return new Response(JSON.stringify(count), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in user-referral-count:', error);
    throw error;
  }
}

export default withAuth(getUserReferralCountHandler);

export const config: Config = {
  path: '/api/user/:userId/referral-count',
  method: 'GET',
};
