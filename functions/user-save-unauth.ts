import { saveUserUnauth } from '@/db/user';
import type { Config, Context } from '@netlify/functions';
import { withSentry } from './utils/sentry';

export default withSentry(async (request: Request, _context: Context) => {
  try {
    const data = await request.json();

    // Handle both 'id' and 'userId' for backward compatibility
    const userId = data.userId || data.id;

    if (!userId) {
      return new Response(JSON.stringify({ error: 'userId is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const result = await saveUserUnauth(userId, data.mainEvm);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in user-save-unauth:', error);
    throw error;
  }
});

export const config: Config = {
  path: '/api/user/save-unauth',
  method: 'POST',
};
