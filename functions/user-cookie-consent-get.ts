import { getUserCookieConsent } from '@/db/user';
import type { Config, Context } from '@netlify/functions';

export default async (_request: Request, context: Context) => {
  try {
    const { userId } = context.params;

    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), { 
        status: 400 
      });
    }

    const consent = await getUserCookieConsent(userId);
    return new Response(JSON.stringify({ accepted: consent }), { status: 200 });
  } catch (error) {
    console.error('Error in user-cookie-consent-get:', error);
    return new Response(JSON.stringify({ error: 'Failed to get cookie consent' }), { 
      status: 500 
    });
  }
};

export const config: Config = {
  path: '/api/user/:userId/cookie-consent',
  method: 'GET',
};
