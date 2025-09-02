import { getUserById } from '@/db/user';
import { UserNotFoundError } from '@/utils/errors';
import type { Config, Context } from '@netlify/functions';

export default async (_request: Request, context: Context) => {
  const { userId } = context.params;

  if (!userId) {
    throw new UserNotFoundError(userId);
  }

  try {
    const user = await getUserById(userId);
    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error('Error in user-get:', error);
    throw error;
  }
};

export const config: Config = {
  path: '/api/user/:userId',
  method: 'GET',
};
