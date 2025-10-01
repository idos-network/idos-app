import { verifySignature } from '@/utils/verify-signatures';
import type { Config, Context } from '@netlify/functions';

import jwt from 'jsonwebtoken';
import {
  JWT_EXPIRES_IN,
  JWT_SECRET,
  REFRESH_TOKEN_EXPIRES_IN,
} from './utils/constants';
import { withSentry } from './utils/sentry';
import * as Sentry from '@sentry/aws-serverless';
import { getUserWalletByAddress } from '@/db/user-wallets';
import {
  getExistingToken,
  insertUserToken,
  updateUserToken,
} from '@/db/user-tokens';

export default withSentry(async (request: Request, _context: Context) => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { publicAddress, publicKey, signature, message, nonce, walletType } =
      await request.json();

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

    const walletRecord = await getUserWalletByAddress(publicAddress);

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

    const existingToken = await getExistingToken(publicAddress);

    if (existingToken.length > 0) {
      await updateUserToken(
        userId,
        accessToken,
        refreshToken,
        existingToken[0].id,
      );
    } else {
      await insertUserToken(
        userId,
        publicAddress,
        walletType,
        accessToken,
        refreshToken,
      );
    }

    return new Response(
      JSON.stringify({
        accessToken,
        refreshToken,
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
    Sentry.captureException(error);
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
});

export const config: Config = {
  path: '/api/auth/verify',
  method: 'POST',
};
