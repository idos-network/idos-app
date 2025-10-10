import { generateFaceScanToken } from '@/db/user';
import { UserNotFoundError } from '@/utils/errors';
import type { Config, Context } from '@netlify/functions';
import { withSentry } from './utils/sentry';

export default withSentry(async (_request: Request, context: Context) => {
  // TODO: Fix after authorization is implemented
  const { userId } = context.params;

  if (!userId) {
    throw new UserNotFoundError(userId);
  }

  const token = await generateFaceScanToken(userId);

  const url = new URL(context.url);
  url.pathname = '/face-sign-mobile';
  url.searchParams.set('token', token);

  return new Response(
    JSON.stringify({ url: url.toString() }),
    { status: 200 },
  );
});

export const config: Config = {
  path: '/api/face-sign/:userId/mobile-url',
  method: 'POST',
};
