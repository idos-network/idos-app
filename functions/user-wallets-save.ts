import { saveUserWallets } from '@/db/user-wallets';
import { saveUserWalletsSchema } from '@/interfaces/user-wallets';
import type { Config, Context } from '@netlify/functions';
import { withSentry } from './utils/sentry';

export default withSentry(async (request: Request, _context: Context) => {
  try {
    const requestData = saveUserWalletsSchema.parse(await request.json());

    const result = await saveUserWallets(
      requestData.userId,
      requestData.wallets,
    );

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error('Error in user-wallets-save:', error);
    throw error;
  }
});

export const config: Config = {
  path: '/api/user-wallets/save',
  method: 'POST',
};
