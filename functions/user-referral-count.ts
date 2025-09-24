import { getUserReferralCount } from '@/db/referrals';
import { ValidationError } from '@/utils/errors';
import type { Config, Context } from '@netlify/functions';

export default async (_request: Request, context: Context) => {
  const { userId } = context.params;

  if (!userId) {
    throw new ValidationError('User ID is required');
  }

  try {
    const user = await getUserReferralCount(userId);
    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error('Error in user-referral-count:', error);
    throw error;
  }
};

export const config: Config = {
  path: '/api/user/:userId/referral-count',
  method: 'GET',
};
