import { getUserByFaceSignToken } from '@/db/user';
import { UserNotFoundError } from '@/utils/errors';
import type { Config, Context } from '@netlify/functions';
import { withSentry } from './utils/sentry';

export default withSentry(async (_request: Request, context: Context) => {
  const { token } = context.params;

  if (!token) {
    throw new UserNotFoundError(token);
  }

  const user = await getUserByFaceSignToken(token);

  if (!user) {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Invalid, empty or expired token.',
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }

  return new Response(
    JSON.stringify({ userId: user.id }),
    { status: 200 },
  );
});

export const config: Config = {
  path: '/api/face-sign/:token/user',
  method: 'GET',
};
