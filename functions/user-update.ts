import type { Config, Context } from '@netlify/functions';
import { updateUser } from '@/db/user';
import { idOSUserSchema } from '@/interfaces/user';
import { InternalServerError } from '@/utils/errors';

export default async (request: Request, _context: Context) => {
  try {
    const userData = idOSUserSchema.parse(await request.json());

    const result = await updateUser(userData);
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    throw new InternalServerError(
      error instanceof Error ? error.message : 'Internal server error',
    );
  }
};

export const config: Config = {
  path: '/api/user/update',
  method: 'POST',
};
