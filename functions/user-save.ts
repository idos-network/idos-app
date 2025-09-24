import { saveUser, userNameExists } from '@/db/user';
import type { Config, Context } from '@netlify/functions';
import { generateUniqueName } from './utils/name-generator';
import { withAuth, type AuthenticatedRequest } from './middleware/auth';

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

    let name: string;

    while (true) {
      name = await generateUniqueName();
      const exists = await userNameExists(name);
      if (!exists) {
        break;
      }
    }

    const result = await saveUser(data, name);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in user-save:', error);
    return new Response(JSON.stringify({ error: 'Failed to save user' }), {
      status: 500,
    });
  }
}

export default withAuth(saveUserHandler);

export const config: Config = {
  path: '/api/user/save',
  method: 'POST',
};
