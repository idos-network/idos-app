import { saveUserCookieConsent } from '@/db/user';
import type { Config, Context } from '@netlify/functions';
import { z } from 'zod';

const cookieConsentSchema = z.object({
  accepted: z.number().min(0).max(2),
});

export default async (request: Request, context: Context) => {
  try {
    const { userId } = context.params;
    const { accepted } = cookieConsentSchema.parse(await request.json());

    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), {
        status: 400,
      });
    }

    const result = await saveUserCookieConsent(userId, accepted);
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error('Error in user-cookie-consent-save:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to save cookie consent' }),
      {
        status: 500,
      },
    );
  }
};

export const config: Config = {
  path: '/api/user/:userId/cookie-consent-save',
  method: 'POST',
};
