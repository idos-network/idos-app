import type { Config, Context } from '@netlify/functions';
import { getUserById, getUserByReferralCode } from '@/db/user';

export default async (request: Request, _context: Context) => {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  const referralCode = url.searchParams.get('referralCode');

  try {
    if (id) {
      const user = await getUserById(id);
      return new Response(JSON.stringify(user), { status: 200 });
    }

    if (referralCode) {
      const user = await getUserByReferralCode(referralCode);
      return new Response(JSON.stringify(user), { status: 200 });
    }

    return new Response(
      JSON.stringify({ error: 'Either id or referralCode is required' }),
      { status: 400 },
    );
  } catch (error) {
    console.error('Get user error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
};

export const config: Config = {
  path: '/api/user',
  method: 'GET',
};
