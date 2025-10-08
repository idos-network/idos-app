import { TwitterApi } from 'twitter-api-v2';

import type { Config, Context } from '@netlify/functions';
import { withSentry } from './utils/sentry';
import { saveUserXCodeAndState } from '@/db/user';
import { withAuth, type AuthenticatedRequest } from './middleware/auth';

async function xOAuthHandler(request: AuthenticatedRequest, _context: Context) {
  try {
    const data = await request.json();

    if (data.id !== request.userId) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized to authenticate user' }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    const client = new TwitterApi({
      clientId: process.env.X_CLIENT_ID as string,
      clientSecret: process.env.X_CLIENT_SECRET as string,
    });

    const originUrl = new URL(request.url).origin;
    const callbackUrl = `${originUrl}/api/callback/oauth2`;

    const { url, codeVerifier, state } = client.generateOAuth2AuthLink(
      callbackUrl,
      { scope: ['users.read', 'tweet.read'] },
    );

    await saveUserXCodeAndState(data.id, codeVerifier, state);

    return new Response(JSON.stringify({ url, codeVerifier, state }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in x-oauth:', error);
    throw error;
  }
}

export default withSentry(withAuth(xOAuthHandler));

export const config: Config = {
  path: '/api/user/:userId/x-oauth',
  method: 'POST',
};
