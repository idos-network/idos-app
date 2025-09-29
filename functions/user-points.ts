import { getUserPoints } from '@/db/user';
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
    const points = await getUserPoints(userId);
    return new Response(JSON.stringify(points), { status: 200 });
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error in user-points:', error);
    throw error;
  }
});

export const config: Config = {
  path: '/api/user/:userId/points',
  method: 'GET',
};
