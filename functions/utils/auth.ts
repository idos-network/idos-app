import { env } from '@/server_env';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import { verifyMessage } from 'viem';

type WalletType = 'evm' | 'near' | 'stellar' | 'xrpl';

type ChallengePayload = {
  sub: string; // address
  wt: WalletType;
  jti: string; // nonce
  typ: 'challenge';
};

type AuthPayload = {
  sub: string; // userId
  typ: 'auth';
};

const CHALLENGE_TTL_SECONDS = 5 * 60;
const AUTH_TTL_SECONDS = 7 * 24 * 60 * 60;

export function createChallengeToken(address: string, walletType: WalletType): { token: string; nonce: string; message: string } {
  const nonce = randomUUID();
  const payload: ChallengePayload = {
    sub: address,
    wt: walletType,
    jti: nonce,
    typ: 'challenge',
  };

  const token = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: CHALLENGE_TTL_SECONDS,
    issuer: env.JWT_ISSUER,
    audience: env.JWT_AUDIENCE,
  });

  const message = buildChallengeMessage(token);
  return { token, nonce, message };
}

export function verifyChallengeToken(token: string): ChallengePayload {
  const decoded = jwt.verify(token, env.JWT_SECRET, {
    issuer: env.JWT_ISSUER,
    audience: env.JWT_AUDIENCE,
  }) as jwt.JwtPayload;

  if (decoded.typ !== 'challenge' || !decoded.sub || !decoded.jti || !decoded.wt) {
    throw new Error('Invalid challenge token');
  }

  return {
    sub: decoded.sub as string,
    wt: decoded.wt as WalletType,
    jti: decoded.jti as string,
    typ: 'challenge',
  };
}

export function signAuthToken(userId: string): string {
  const payload: AuthPayload = {
    sub: userId,
    typ: 'auth',
  };

  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: AUTH_TTL_SECONDS,
    issuer: env.JWT_ISSUER,
    audience: env.JWT_AUDIENCE,
  });
}

export function verifyAuthToken(token: string): { userId: string } {
  const decoded = jwt.verify(token, env.JWT_SECRET, {
    issuer: env.JWT_ISSUER,
    audience: env.JWT_AUDIENCE,
  }) as jwt.JwtPayload;

  if (decoded.typ !== 'auth' || !decoded.sub) {
    throw new Error('Invalid auth token');
  }

  return { userId: decoded.sub as string };
}

export function extractBearer(req: Request): string | null {
  const auth = req.headers.get('authorization') || req.headers.get('Authorization');
  if (!auth) return null;
  const [scheme, token] = auth.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) return null;
  return token;
}

export function buildChallengeMessage(challengeToken: string): string {
  return `idOS login:\n\nSign this token to authenticate.\n\nToken:\n${challengeToken}`;
}

export async function verifyWalletSignature(
  walletType: WalletType,
  address: string,
  message: string,
  signature: string,
): Promise<boolean> {
  switch (walletType) {
    case 'evm': {
      try {
        return await verifyMessage({
          address: address as `0x${string}`,
          message,
          signature: signature as `0x${string}`,
        });
      } catch {
        return false;
      }
    }
    case 'near': {
      // TODO: Implement NEAR signature verification (requires account public key fetch)
      return false;
    }
    case 'stellar': {
      // TODO: Implement Stellar signature verification
      return false;
    }
    case 'xrpl': {
      // TODO: Implement XRPL signature verification
      return false;
    }
    default:
      return false;
  }
}

// Simple guard to use in Netlify functions
export function requireAuth<T extends (req: Request, ctx: any) => Promise<Response> | Response>(
  handler: T,
) {
  return async (request: Request, context: any) => {
    try {
      const token = extractBearer(request);
      if (!token) {
        return new Response('Unauthorized', { status: 401 });
      }
      const { userId } = verifyAuthToken(token);
      context.auth = { userId };
      return await handler(request, context);
    } catch {
      return new Response('Unauthorized', { status: 401 });
    }
  };
}