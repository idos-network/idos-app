import { saveUser } from '@/db/user';
import { idOSUserSchema } from '@/interfaces/user';
import type { Config, Context } from '@netlify/functions';
import { withAuth, type AuthenticatedRequest } from './middleware/auth';
import { generateUniqueName } from './utils/name-generator';

async function saveUserHandler(
  request: AuthenticatedRequest,
  _context: Context,
) {
  try {
    const userData = idOSUserSchema.parse(await request.json());

    if (request.userId !== userData.id) {
      return new Response(
        JSON.stringify({
          error: 'Unauthorized to save another user',
        }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    while (true) {
      try {
        userData.name = await generateUniqueName();

        const result = await saveUser(userData);
        return new Response(JSON.stringify(result), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (err) {
        console.log('Name collision, retrying with new name...');
      }
    }
  } catch (error) {
    console.error('Error in user-save:', error);
    throw error;
  }
}

export default withAuth(saveUserHandler);

export const config: Config = {
  path: '/api/user/save',
  method: 'POST',
};
