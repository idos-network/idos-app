import { idOSProfileRequestSchema } from '@/interfaces/idos-profile';
import type { Config, Context } from '@netlify/functions';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import { withSentry } from './utils/sentry';
import * as Sentry from '@sentry/aws-serverless';
import { issuerWithKey } from './utils/idos-issuer';
import { sql } from 'drizzle-orm';

export default withSentry(async (request: Request, context: Context) => {
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

  const pool = new Pool({ connectionString: process.env.NETLIFY_DATABASE_URL });
  const db = drizzle(pool);

  pool.on("error", (err) => {
    Sentry.captureException(err);
    console.error("Unexpected error on idle client", err);
  });

  try {
    const {
      userId,
      userEncryptionPublicKey,
      address,
      ownershipProofMessage,
      ownershipProofSignature,
      publicKey,
      walletType,
      encryptionPasswordStore,
    } = idOSProfileRequestSchema.parse(await request.json());

    Sentry.setUser({ id: userId });

    const user = {
      id: userId,
      recipient_encryption_public_key: userEncryptionPublicKey,
      encryption_password_store: encryptionPasswordStore as string,
    };

    const walletTypeMap: Record<string, string> = {
      evm: 'EVM',
      near: 'NEAR',
      stellar: 'Stellar',
      xrpl: 'XRPL',
    };

    const wallet = {
      address,
      wallet_type: walletTypeMap[walletType],
      message: ownershipProofMessage,
      signature: ownershipProofSignature,
      public_key: publicKey,
    };

    await db.transaction(async (tx: any) => {
      const { keyLock, idOSIssuer } = await issuerWithKey();

      // https://neon.com/guides/rate-limiting
      await tx.execute(
        sql`SELECT pg_advisory_xact_lock(hashtext(${keyLock}))`
      );

      if (!await idOSIssuer.getUser(userId).catch(() => null)) {
        const response = await idOSIssuer.createUserProfile(user);

        if (!response.id) {
          throw new Error(`Failed to create user profile: ${JSON.stringify(response)}`);
        }
      }

      if (!await idOSIssuer.hasProfile(wallet.address)) {
        const walletResponse = await idOSIssuer.upsertWalletAsInserter({ ...wallet, user_id: userId });

        if (!walletResponse.id) {
          throw new Error(`Failed to upsert wallet: ${JSON.stringify(walletResponse)}`);
        }
      }
    });

    return new Response(
      JSON.stringify({
        message: 'User created successfully',
      }),
      {
        status: 200,
      },
    );
  } finally {
    context.waitUntil(pool.end());
  }
});

export const config: Config = {
  path: '/api/idos-profile',
  method: 'POST',
};
