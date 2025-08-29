import type { Config, Context } from '@netlify/functions';
import { randomBytes } from 'crypto';

export default async function handler(request: Request, _context: Context) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { publicAddress, publicKey } = await request.json();

    if (!publicAddress || !publicKey) {
      return new Response(
        JSON.stringify({
          error: 'Public address and public key are required',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    const nonce = randomBytes(32).toString('hex');

    const message = `Sign this message to authenticate with idOS App.\n\nAddress: ${publicAddress}\nNonce: ${nonce}\nTimestamp: ${Date.now()}`;

    // TODO: save message to db
    return new Response(
      JSON.stringify({
        message,
        nonce,
        publicAddress,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error in auth-message:', error);
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
  path: '/api/auth/message',
  method: 'POST',
};
