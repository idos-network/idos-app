import { getUserById } from '@/db/user';
import { UserNotFoundError } from '@/utils/errors';
import type { Config, Context } from '@netlify/functions';
import { createResponse } from './utils/response';
import { withSentry } from './utils/sentry';

export default withSentry(async (_request: Request, context: Context) => {
  const { userId } = context.params;

  if (!userId) {
    throw new UserNotFoundError(userId);
  }

  const user = await getUserById(userId).then(res => res[0]);

  if (!user) {
    throw new UserNotFoundError(userId);
  }

  return createResponse({
    // If true liveness was enrolled and we should ask for DWG
    faceSignDone: user.faceSignUserId !== null,
  }, 200);
});

export const config: Config = {
  path: '/api/face-sign/:userId/status',
  method: 'GET',
};
