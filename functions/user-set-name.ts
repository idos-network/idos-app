import { setUserName } from '@/db/user';
import type { Config, Context } from '@netlify/functions';
import { withAuth, type AuthenticatedRequest } from './middleware/auth';

async function setUserNameHandler(
  request: AuthenticatedRequest,
  _context: Context,
) {
  try {
    const data = await request.json();

    if (data.userId !== request.userId) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized to set user name' }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    const result = await setUserName(data.userId);

    return new Response(JSON.stringify({ success: true, result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in user-set-name:', error);
    return new Response(JSON.stringify({ error: 'Failed to set user name' }), {
      status: 500,
    });
  }
}

export default withAuth(setUserNameHandler);

export const config: Config = {
  path: '/api/user/set-name',
  method: 'POST',
};
