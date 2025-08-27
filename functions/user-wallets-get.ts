import { getUserWallets } from '@/db/user-wallets';
import { UserNotFoundError } from '@/utils/errors';
import type { Config, Context } from '@netlify/functions';

export default async (_request: Request, context: Context) => {
  const { userId } = context.params;

  if (!userId) {
    throw new UserNotFoundError(userId);
  }

  try {
    const wallets = await getUserWallets(userId);
    return new Response(JSON.stringify(wallets), { status: 200 });
  } catch (error) {
    console.error('Error in user-wallets-get:', error);
    throw error;
  }
};

export const config: Config = {
  path: '/api/user-wallets/:userId',
  method: 'GET',
};
