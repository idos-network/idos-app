import { saveUser } from '@/db/user';
import { idOSUserSchema } from '@/interfaces/user';
import type { Config, Context } from '@netlify/functions';
import { generateUniqueName } from './utils/name-generator';

export default async (request: Request, _context: Context) => {
  try {
    const userData = idOSUserSchema.parse(await request.json());

    userData.name = await generateUniqueName();

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
