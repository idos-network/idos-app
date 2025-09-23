import { updateUser } from '@/db/user';
import type { Config, Context } from '@netlify/functions';

export default async (request: Request, _context: Context) => {
  try {
    const result = await updateUser(await request.json());
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error('Error in user-update:', error);
    throw error;
  }
};

export const config: Config = {
  path: '/api/user/update',
  method: 'POST',
};
