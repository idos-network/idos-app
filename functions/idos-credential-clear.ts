import { clearUserPopCredentialId, getUserById } from '@/db/user';
import type { Config, Context } from '@netlify/functions';
import { withAuth, type AuthenticatedRequest } from './middleware/auth';

async function handler(request: AuthenticatedRequest, _context: Context) {
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Method not allowed. Use POST.',
      }),
      { status: 405 },
    );
  }

  const { userId } = (await request.json()) as { userId: string };

  if (!userId) {
    return new Response(
      JSON.stringify({ success: false, message: 'userId is required' }),
      { status: 400 },
    );
  }

  if (request.userId !== userId) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized to modify another user' }),
      { status: 403 },
    );
  }

  const user = await getUserById(userId).then((res) => res[0]);
  if (!user) {
    return new Response(
      JSON.stringify({ success: false, message: 'User not found.' }),
      { status: 404 },
    );
  }

  await clearUserPopCredentialId(userId);

  return new Response(
    JSON.stringify({ success: true, message: 'PoP credential cleared.' }),
    { status: 200 },
  );
}

export default withAuth(handler);

export const config: Config = {
  path: '/api/idos-credential/clear',
  method: 'POST',
};
