import { idOSProfileRequestSchema } from '@/interfaces/idos-profile';
import { idOSIssuer as idOSIssuerClass } from '@idos-network/issuer';
import type { Config, Context } from '@netlify/functions';
import nacl from 'tweetnacl';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import { withSentry } from './utils/sentry';
import * as Sentry from '@sentry/aws-serverless';

export default withSentry(async (request: Request, context: Context) => {
  const pool = new Pool({ connectionString: process.env.NETLIFY_DATABASE_URL });

  pool.on("error", (err) => {
    Sentry.captureException(err);
    console.error("Unexpected error on idle client", err);
  });

  const db = drizzle(pool);

  try {
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

    const idOSIssuer = await idOSIssuerClass.init({
      nodeUrl: process.env.VITE_IDOS_NODE_URL as string,
      signingKeyPair: nacl.sign.keyPair.fromSecretKey(
        Buffer.from(process.env.ISSUER_SIGNING_SECRET_KEY as string, 'hex'),
      ),
      encryptionSecretKey: Buffer.from(
        process.env.ISSUER_ENCRYPTION_SECRET_KEY as string,
        'hex',
      ),
    });

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
      // https://neon.com/guides/rate-limiting
      await tx.execute("SELECT pg_advisory_xact_lock(hashtex('idos_issuer_key'))");

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
