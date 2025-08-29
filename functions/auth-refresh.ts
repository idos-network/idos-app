import { db } from '@/db/connection';
import { userTokens } from '@/db/schema';
import type { Config, Context } from '@netlify/functions';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import {
  JWT_EXPIRES_IN,
  JWT_SECRET,
  REFRESH_TOKEN_EXPIRES_IN,
} from './utils/constants';

export default async function handler(request: Request, _context: Context) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { refreshToken } = await request.json();

    if (!refreshToken) {
      return new Response(
        JSON.stringify({
          error: 'Refresh token is required',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, JWT_SECRET) as any;
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: 'Invalid refresh token',
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    if (decoded.type !== 'refresh') {
      return new Response(
        JSON.stringify({
          error: 'Invalid token type',
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    const tokenRecord = await db
      .select()
      .from(userTokens)
      .where(eq(userTokens.refreshToken, refreshToken))
      .limit(1);

    if (tokenRecord.length === 0) {
      return new Response(
        JSON.stringify({
          error: 'Refresh token not found',
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    const { publicAddress, userId } = tokenRecord[0];

    const newAccessToken = jwt.sign(
      {
        userId,
        publicAddress,
        type: 'access',
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    const newRefreshToken = jwt.sign(
      {
        userId,
        publicAddress,
        type: 'refresh',
      },
      JWT_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRES_IN },
    );

    await db
      .update(userTokens)
      .set({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        updatedAt: new Date(),
      })
      .where(eq(userTokens.id, tokenRecord[0].id));

    return new Response(
      JSON.stringify({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        publicAddress,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error in auth-refresh:', error);
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
  path: '/api/auth/refresh',
  method: 'POST',
};
