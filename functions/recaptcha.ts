import type { Context } from '@netlify/functions';

export default async (request: Request, _context: Context) => {
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Method not allowed. Use POST.',
      }),
      {
        status: 405,
      },
    );
  }

  let token: string;
  try {
    const body = await request.json();
    token = body.token;
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Invalid JSON in request body',
      }),
      {
        status: 400,
      },
    );
  }

  if (!token) {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'reCAPTCHA token is required',
      }),
      {
        status: 400,
      },
    );
  }

  try {
    const verificationResponse = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          secret: process.env.RECAPTCHA_SECRET_KEY || '',
          response: token,
        }),
      },
    );

    const verificationResult = await verificationResponse.json();

    if (verificationResult.success) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'reCAPTCHA verification successful',
        }),
        {
          status: 200,
        },
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'reCAPTCHA verification failed',
          errors: verificationResult['error-codes'],
        }),
        {
          status: 400,
        },
      );
    }
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Internal server error during reCAPTCHA verification',
      }),
      {
        status: 500,
      },
    );
  }
};
