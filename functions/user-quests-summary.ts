import { getUserQuestsSummary } from '@/db/user-quests';
import { UserNotFoundError } from '@/utils/errors';
import type { Config, Context } from '@netlify/functions';
import { withAuth, type AuthenticatedRequest } from './middleware/auth';
import { withSentry } from './utils/sentry';
import * as Sentry from '@sentry/aws-serverless';

async function getUserQuestsSummaryHandler(
  request: AuthenticatedRequest,
  context: Context,
) {
  const { userId } = context.params;

  if (!userId) {
    throw new UserNotFoundError(userId);
  }

  if (request.userId !== userId) {
    return new Response(
      JSON.stringify({
        error: 'Unauthorized to get quest summary for another user',
      }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }

  try {
    const userQuestsSummary = await getUserQuestsSummary(userId);
    return new Response(JSON.stringify(userQuestsSummary), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error in user-quests-summary:', error);
    throw error;
  }
}

export default withSentry(withAuth(getUserQuestsSummaryHandler));

export const config: Config = {
  path: '/api/user-quests/:userId/summary',
  method: 'GET',
};
