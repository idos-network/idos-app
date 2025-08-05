import type { Config, Context } from '@netlify/functions';
import { updateUser, type IdOSUser } from '@/db/user';

export default async (request: Request, _context: Context) => {
  try {
    const userData = (await request.json()) as IdOSUser;

    const result = await updateUser(userData);
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error('Update user error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
};

export const config: Config = {
  path: '/api/user/update',
  method: 'POST',
};
