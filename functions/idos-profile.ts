import { idOSProfileRequestSchema } from '@/interfaces/idos-profile';
import { idOSIssuer as idOSIssuerClass } from '@idos-network/issuer';
import type { Config, Context } from '@netlify/functions';
import nacl from 'tweetnacl';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';

export default async (request: Request, context: Context) => {
  const pool = new Pool({ connectionString: process.env.NETLIFY_DATABASE_URL });
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

    const idOSIssuer = idOSIssuerClass.init({
      nodeUrl: process.env.VITE_IDOS_NODE_URL as string,
      signingKeyPair: nacl.sign.keyPair.fromSecretKey(
        Buffer.from(process.env.ISSUER_SIGNING_SECRET_KEY as string, 'hex'),
      ),
      encryptionSecretKey: Buffer.from(
        process.env.ISSUER_ENCRYPTION_SECRET_KEY as string,
        'hex',
      ),
    });

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

    const idOSIssuerInstance = await idOSIssuer;

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
      await tx.execute('LOCK TABLE lock_table IN EXCLUSIVE MODE');

      if (!await idOSIssuerInstance.getUser(userId).catch(() => null)) {
        await idOSIssuerInstance.createUserProfile(user);
      }

      if(!await idOSIssuerInstance.hasProfile(wallet.address)) {
        await idOSIssuerInstance.upsertWalletAsInserter({...wallet, user_id: userId});
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
    // Ensure pool is closed after request
    context.waitUntil(pool.end());
  }
};

export const config: Config = {
  path: '/api/idos-profile',
  method: 'POST',
};
