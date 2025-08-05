import type { Config, Context } from '@netlify/functions';
import { getUserReferralCount } from '@/db/user';

export default async (request: Request, _context: Context) => {
  const url = new URL(request.url);
  const referralCode = url.searchParams.get('referralCode');

  try {
    if (!referralCode) {
      return new Response(
        JSON.stringify({ error: 'Referral code is required' }),
        {
          status: 404,
        },
      );
    }

    const user = await getUserReferralCount(referralCode);
    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error('Get user error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
};

export const config: Config = {
  path: '/api/user/referral-count',
  method: 'GET',
};
