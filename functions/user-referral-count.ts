import type { Config, Context } from '@netlify/functions';
import { getUserReferralCount } from '@/db/user';
import { InternalServerError, ValidationError } from '@/utils/errors';

export default async (_request: Request, context: Context) => {
  const { referralCode } = context.params;

  try {
    if (!referralCode) {
      throw new ValidationError('Referral code is required');
    }

    const user = await getUserReferralCount(referralCode);
    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    throw new InternalServerError(
      error instanceof Error ? error.message : 'Internal server error',
    );
  }
};

export const config: Config = {
  path: '/api/user/:referralCode/referral-count',
  method: 'GET',
};
