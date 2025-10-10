import type { Config, Context } from '@netlify/functions';
import { withSentry } from './utils/sentry';

const facetecServer = process.env.FACETEC_SERVER as string;

export default withSentry(async (_request: Request, _context: Context) => {
  const response = await fetch(`${facetecServer}sdk/public-key`, {
    method: 'GET',
  });

  if (!response.ok) {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Failed to get public key from FaceTec server.',
      }),
      {
        status: 500,
      },
    );
  }

  const responseData = await response.text();

  return new Response(
    responseData,
    { status: 200 },
  );
});

export const config: Config = {
  path: '/api/face-sign/public-key',
  method: 'GET',
};
