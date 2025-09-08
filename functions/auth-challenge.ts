import type { Config, Context } from '@netlify/functions';
import { z } from 'zod';
import { createChallengeToken } from './utils/auth';

const bodySchema = z.object({
  address: z.string().min(1),
  walletType: z.enum(['evm', 'near', 'stellar', 'xrpl']),
});

export default async (request: Request, _context: Context) => {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const { address, walletType } = bodySchema.parse(await request.json());
  const { token, nonce, message } = createChallengeToken(address, walletType);

  return new Response(JSON.stringify({ challengeToken: token, nonce, message }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};

export const config: Config = {
  path: '/api/auth/challenge',
  method: 'POST',
};