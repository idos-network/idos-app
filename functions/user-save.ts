import type { Config, Context } from '@netlify/functions';
import { saveUser } from '@/db/user';
import { idOSUserSchema } from '@/interfaces/user';

export default async (request: Request, _context: Context) => {
  try {
    const userData = idOSUserSchema.parse(await request.json());

    const result = await saveUser(userData);
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error('Error in user-save:', error);
    throw error;
  }
};

export const config: Config = {
  path: '/api/user/save',
  method: 'POST',
};
