import { updateUser } from '@/db/user';
import type { Config, Context } from '@netlify/functions';
import { idOSUserSchema } from '@/interfaces/user';
import { withAuth, type AuthenticatedRequest } from './middleware/auth';
import { withSentry } from './utils/sentry';

async function updateUserHandler(
  request: AuthenticatedRequest,
  _context: Context,
) {
  try {
    const userData = idOSUserSchema.parse(await request.json());

    if (request.userId !== userData.id) {
      return new Response(
        JSON.stringify({
          error: 'Unauthorized to update another user',
        }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    const result = await updateUser(userData);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in user-update:', error);
    throw error;
  }
}

export default withSentry(withAuth(updateUserHandler));

export const config: Config = {
  path: '/api/user/update',
  method: 'POST',
};
