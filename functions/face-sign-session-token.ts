import { UserNotFoundError } from '@/utils/errors';
import type { Config, Context } from '@netlify/functions';

const facetecServer = process.env.FACETEC_SERVER as string;

export default async (request: Request, context: Context) => {
  // TODO: Get userID from token or session or whatever is available
  const { userId } = context.params;

  if (!userId) {
    throw new UserNotFoundError(userId);
  }

  const { key, deviceIdentifier } = await request.json();

  const response = await fetch(`${facetecServer}session-token`, {
    method: 'GET',
    headers: {
      'X-Device-Key': key,
      'X-Device-Identifier': deviceIdentifier,
    },
  });

  if (!response.ok) {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Failed to get session token from FaceTec server.',
      }),
      {
        status: 500,
      },
    );
  }

  const responseData = await response.json();
  const { sessionToken } = responseData;

  return new Response(
    JSON.stringify({ sessionToken }),
    { status: 200 },
  );
};

export const config: Config = {
  path: '/api/face-sign/:userId/session-token',
  method: 'POST',
};
