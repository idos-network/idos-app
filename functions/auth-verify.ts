import { db } from '@/db/connection';
import { userTokens, userWallets } from '@/db/schema';
import { verifySignature } from '@/utils/verify-signatures';
import type { Config, Context } from '@netlify/functions';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

const JWT_SECRET =
  process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '10s'; // TODO: change to 1h
const REFRESH_TOKEN_EXPIRES_IN = '60'; //TODO: change to 7d

export default async function handler(request: Request, _context: Context) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { publicAddress, publicKey, signature, message, nonce, walletType } =
      await request.json();
    console.log(
      publicAddress,
      publicKey,
      signature,
      message,
      nonce,
      walletType,
    );

    if (
      !publicAddress ||
      !publicKey ||
      !signature ||
      !message ||
      !nonce ||
      !walletType
    ) {
      return new Response(
        JSON.stringify({
          error:
            'All fields are required: publicAddress, publicKey, signature, message, nonce',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    const walletPayload = {
      address: publicAddress,
      message,
      signature,
      public_key: [publicKey],
      walletType,
    };

    const isValidSignature = await verifySignature(walletPayload);
    if (!isValidSignature) {
      return new Response(
        JSON.stringify({
          error: 'Invalid signature',
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    const walletRecord = await db
      .select()
      .from(userWallets)
      .where(eq(userWallets.address, publicAddress))
      .limit(1);

    if (walletRecord.length === 0) {
      return new Response(
        JSON.stringify({
          error: 'Address not found in user wallets',
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    const userId = walletRecord[0].userId;

    const accessToken = jwt.sign(
      {
        userId,
        publicAddress,
        type: 'access',
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    const refreshToken = jwt.sign(
      {
        userId,
        publicAddress,
        type: 'refresh',
      },
      JWT_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRES_IN },
    );

    const expiresAt = new Date();
    const secondsToAdd = parseInt(REFRESH_TOKEN_EXPIRES_IN);
    expiresAt.setSeconds(expiresAt.getSeconds() + secondsToAdd);

    const existingToken = await db
      .select()
      .from(userTokens)
      .where(eq(userTokens.publicAddress, publicAddress))
      .limit(1);

    if (existingToken.length > 0) {
      await db
        .update(userTokens)
        .set({
          userId,
          accessToken,
          refreshToken,
          expiresAt,
          updatedAt: new Date(),
        })
        .where(eq(userTokens.id, existingToken[0].id));
    } else {
      await db.insert(userTokens).values({
        userId,
        publicAddress,
        walletType,
        accessToken,
        refreshToken,
        expiresAt,
      });
    }

    return new Response(
      JSON.stringify({
        accessToken,
        refreshToken,
        expiresAt: expiresAt.toISOString(),
        walletType,
        publicAddress,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error in auth-verify:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}

export const config: Config = {
  path: '/api/auth/verify',
  method: 'POST',
};
