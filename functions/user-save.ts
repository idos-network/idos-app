import { saveUser } from '@/db/user';
import type { Config, Context } from '@netlify/functions';
import { withAuth, type AuthenticatedRequest } from './middleware/auth';
import { getUserName } from './utils/get-user-name';
import { withSentry } from './utils/sentry';
import * as Sentry from '@sentry/aws-serverless';

async function saveUserHandler(
  request: AuthenticatedRequest,
  _context: Context,
) {
  try {
    const data = await request.json();

    if (data.id !== request.userId) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized to save user' }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }
    const name = await getUserName(data.id);
    const result = await saveUser(data, name);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in user-save:', error);
    Sentry.captureException(error);
    return new Response(JSON.stringify({ error: 'Failed to save user' }), {
      status: 500,
    });
  }
}

export default withSentry(withAuth(saveUserHandler));

export const config: Config = {
  path: '/api/user/save',
  method: 'POST',
};
