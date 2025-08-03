import type { Config, Context } from '@netlify/functions';
import { saveUser, type idOSUser } from '@/db/user';
import { generateReferralCode } from '@/utils/referral-code';

export default async (request: Request, _context: Context) => {
  try {
    const userData = (await request.json()) as idOSUser;

    userData.referralCode = generateReferralCode(userData.id);

    const result = await saveUser(userData as idOSUser);
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error('Save user error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
};

export const config: Config = {
  path: '/api/user/save',
  method: 'POST',
};
