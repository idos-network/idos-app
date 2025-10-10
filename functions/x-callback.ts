import { TwitterApi } from 'twitter-api-v2';

import type { Config, Context } from '@netlify/functions';
import { withSentry } from './utils/sentry';
import { getUserXCodeAndState } from '@/db/user';
import { setUserXHandle } from '@/db/user';

function buildOAuthPopupHtml(
  messageType: 'oauth-success' | 'oauth-error',
  originUrl: string,
): string {
  return `
      <!DOCTYPE html>
      <html>
        <body>
          <script>
            window.opener.postMessage({ type: '${messageType}' }, '${originUrl}/');
          </script>
        </body>
      </html>
    `;
}

export default withSentry(async (request: Request, _context: Context) => {
  const originUrl = new URL(request.url).origin;
  const callbackUrl = `${originUrl}/api/callback/oauth2`;

  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code || !state) {
      throw new Error('Invalid request');
    }

    const user = await getUserXCodeAndState(state);
    if (!user) {
      throw new Error('Invalid request');
    }

    const codeVerifier = user?.codeVerifier || '';
    const stateSession = user?.state;

    if (!codeVerifier || !stateSession) {
      throw new Error('Invalid request');
    }

    const client = new TwitterApi({
      clientId: process.env.X_CLIENT_ID as string,
      clientSecret: process.env.X_CLIENT_SECRET as string,
    });

    const { client: loggedClient } = await client.loginWithOAuth2({
      code,
      codeVerifier,
      redirectUri: callbackUrl,
    });

    const { data: userData } = await loggedClient.v2.me();

    await setUserXHandle(user.userId, `@${userData.username}`);

    return new Response(buildOAuthPopupHtml('oauth-success', originUrl), {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Error in x-oauth client:', error);

    return new Response(buildOAuthPopupHtml('oauth-error', originUrl), {
      status: 400,
      headers: {
        'Content-Type': 'text/html',
      },
    });
  }
});

export const config: Config = {
  path: '/api/callback/oauth2',
  method: 'GET',
};
