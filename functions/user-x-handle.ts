import { getUserXHandle } from '@/db/user';
import { UserNotFoundError } from '@/utils/errors';
import type { Config, Context } from '@netlify/functions';
import { withSentry } from './utils/sentry';
import * as Sentry from '@sentry/aws-serverless';

export default withSentry(async (_request: Request, context: Context) => {
  const { userId } = context.params;

  if (!userId) {
    throw new UserNotFoundError(userId);
  }

  try {
    const xHandle = await getUserXHandle(userId);
    return new Response(JSON.stringify(xHandle), { status: 200 });
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error in user-x-handle:', error);
    throw error;
  }
});

export const config: Config = {
  path: '/api/user/:userId/x-handle',
  method: 'GET',
};
