import type { Config, Context } from '@netlify/functions';
import { updateUser, idOSUserSchema } from '@/db/user';

export default async (request: Request, _context: Context) => {
  try {
    const userData = idOSUserSchema.parse(await request.json());

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
