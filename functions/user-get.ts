import { getUserById } from '@/db/user';
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
    const users = await getUserById(userId);

    // We need to map it to the idOSUserSchema
    return new Response(
      JSON.stringify(
        users.map((user) => ({
          id: user.id,
          name: user.name ?? undefined,
          mainEvm: user.mainEvm,
          referrerCode: user.referrerCode,
          cookieConsent: user.cookieConsent,
          faceSignUserId: user.faceSignUserId ?? undefined,
          faceSignTokenCreatedAt: user.faceSignTokenCreatedAt ?? undefined,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        })),
      ),
      { status: 200 },
    );
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error in user-get:', error);
    throw error;
  }
});

export const config: Config = {
  path: '/api/user/:userId',
  method: 'GET',
};
