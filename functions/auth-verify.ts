import { getUserIdByWallet } from '@/db/user-wallets';
import type { Config, Context } from '@netlify/functions';
import { z } from 'zod';
import { buildChallengeMessage, signAuthToken, signRefreshToken, verifyChallengeToken, verifyWalletSignature } from './utils/auth';

const bodySchema = z.object({
  address: z.string().min(1),
  walletType: z.enum(['evm', 'near', 'stellar', 'xrpl']),
  signature: z.string().min(1),
  challengeToken: z.string().min(1),
  publicKey: z.string().optional(), // required for near/stellar/xrpl
});

export default async (request: Request, _context: Context) => {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const { address, walletType, signature, challengeToken, publicKey } = bodySchema.parse(await request.json());

  // 1) Validate challenge
  const ch = verifyChallengeToken(challengeToken);
  if (ch.sub.toLowerCase() !== address.toLowerCase() || ch.wt !== walletType) {
    return new Response('Invalid challenge', { status: 400 });
  }

  // 2) Rebuild message and verify signature
  const message = buildChallengeMessage(challengeToken);
  const publicKeyArray = publicKey ? [publicKey] : [];
  const ok = await verifyWalletSignature(walletType, address, message, signature, publicKeyArray);
  if (!ok) {
    return new Response('Invalid signature', { status: 401 });
  }

  // 3) Resolve user
  const userId = await getUserIdByWallet(address, walletType);
  if (!userId) {
    return new Response('User not found for wallet', { status: 404 });
  }

  // 4) Issue JWT
  const token = signAuthToken(userId);
  const refreshToken = signRefreshToken(userId);
  return new Response(JSON.stringify({ token,refreshToken, userId }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};

export const config: Config = {
  path: '/api/auth/verify',
  method: 'POST',
};