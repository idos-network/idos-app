import type { Config, Context } from '@netlify/functions';
import { z } from 'zod';
import { signAuthToken, signRefreshToken, verifyRefreshToken } from './utils/auth';

const bodySchema = z.object({
  refreshToken: z.string().min(1),
});

export default async (request: Request, _context: Context) => {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { refreshToken } = bodySchema.parse(await request.json());
    const { userId } = verifyRefreshToken(refreshToken);

    // Rotate refresh token
    const newAccessToken = signAuthToken(userId);
    const newRefreshToken = signRefreshToken(userId);

    return new Response(
      JSON.stringify({ token: newAccessToken, refreshToken: newRefreshToken, userId }),
      { status: 200, headers: { 'content-type': 'application/json' } },
    );
  } catch {
    return new Response('Unauthorized', { status: 401 });
  }
};

export const config: Config = {
  path: '/api/auth/refresh',
  method: 'POST',
};