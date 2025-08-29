import { db } from '@/db/connection';
import { userTokens, userWallets } from '@/db/schema';
import type { Context } from '@netlify/functions';
import { and, eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

const JWT_SECRET =
  process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface AuthenticatedRequest extends Request {
  userId?: string;
  publicAddress?: string;
}

export interface AuthContext {
  userId: string;
  publicAddress: string;
}

export async function verifyAuth(
  request: Request,
): Promise<AuthContext | null> {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify the JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as any;
    } catch (error) {
      console.error('JWT verification failed:', error);
      return null;
    }

    if (decoded.type !== 'access') {
      console.error('Invalid token type:', decoded.type);
      return null;
    }

    const { userId, publicAddress } = decoded;

    if (!userId || !publicAddress) {
      console.error('Missing required fields in JWT:', {
        userId,
        publicAddress,
        decoded,
      });
      return null;
    }

    console.log('JWT decoded successfully:', {
      userId,
      publicAddress,
      type: decoded.type,
    });

    const tokenRecord = await db
      .select()
      .from(userTokens)
      .where(
        and(
          eq(userTokens.accessToken, token),
          eq(userTokens.publicAddress, publicAddress),
        ),
      )
      .limit(1);

    if (tokenRecord.length === 0) {
      console.error('Token not found in database for address:', publicAddress);
      return null;
    }

    if (new Date() > tokenRecord[0].expiresAt) {
      console.error('Token expired for address:', publicAddress);
      return null;
    }

    const walletRecord = await db
      .select()
      .from(userWallets)
      .where(
        and(
          eq(userWallets.userId, userId),
          eq(userWallets.address, publicAddress),
        ),
      )
      .limit(1);

    if (walletRecord.length === 0) {
      console.error('Wallet not found for userId and address:', {
        userId,
        publicAddress,
      });
      return null;
    }

    return { userId, publicAddress };
  } catch (error) {
    console.error('Error verifying auth:', error);
    return null;
  }
}

export function withAuth(
  handler: (
    request: AuthenticatedRequest,
    context: Context,
  ) => Promise<Response>,
) {
  return async (request: Request, context: Context): Promise<Response> => {
    const authContext = await verifyAuth(request);

    if (!authContext) {
      return new Response(
        JSON.stringify({
          error: 'Unauthorized',
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    const authenticatedRequest = request as AuthenticatedRequest;
    authenticatedRequest.userId = authContext.userId;
    authenticatedRequest.publicAddress = authContext.publicAddress;

    return handler(authenticatedRequest, context);
  };
}
