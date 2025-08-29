import { getUserReferralCount } from '@/db/user';
import { ValidationError } from '@/utils/errors';
import type { Config, Context } from '@netlify/functions';
import { withAuth, type AuthenticatedRequest } from './middleware/auth';

async function getUserReferralCountHandler(
  request: AuthenticatedRequest,
  context: Context,
) {
  const { referralCode } = context.params;

  if (!referralCode) {
    throw new ValidationError('Referral code is required');
  }

  // For referral count, we need to check if the user is authorized to view this referral code
  // This might need adjustment based on your business logic
  if (request.userId !== referralCode) {
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
    const user = await getUserReferralCount(referralCode);
    return new Response(JSON.stringify(user), {
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
  path: '/api/user/:referralCode/referral-count',
  method: 'GET',
};
