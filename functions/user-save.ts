import { saveUser } from '@/db/user';
import type { Config, Context } from '@netlify/functions';
import { generateUniqueName } from './utils/name-generator';

export default async (request: Request, _context: Context) => {
  try {
    const data = await request.json();

    while (true) {
      try {
        const name = await generateUniqueName();
        const result = await saveUser(data, name);
        return new Response(JSON.stringify(result), { status: 200 });
      } catch (err) {
        console.log('Name collision, retrying with new name...');
      }
    }
  } catch (error) {
    console.error('Error in user-save:', error);
    throw error;
  }
};

export const config: Config = {
  path: '/api/user/save',
  method: 'POST',
};
