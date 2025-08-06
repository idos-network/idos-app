import type { Config, Context } from '@netlify/functions';
import { getUserReferralCount } from '@/db/user';
import { ValidationError } from '@/utils/errors';

export default async (_request: Request, context: Context) => {
  const { referralCode } = context.params;

  if (!referralCode) {
    throw new ValidationError('Referral code is required');
  }

  try {
    const user = await getUserReferralCount(referralCode);
    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error('Error in user-referral-count:', error);
    throw error;
  }
};

export const config: Config = {
  path: '/api/user/:referralCode/referral-count',
  method: 'GET',
};
