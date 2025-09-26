import { idOSProfileRequestSchema } from '@/interfaces/idos-profile';
import { idOSIssuer as idOSIssuerClass } from '@idos-network/issuer';
import type { Config, Context } from '@netlify/functions';
import nacl from 'tweetnacl';
import { db } from '@/db/connection';

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
    await idOSIssuerInstance.createUser(user, wallet);
  });

  return new Response(
    JSON.stringify({
      message: 'User created successfully',
    }),
    {
      status: 200,
    },
  );
};

export const config: Config = {
  path: '/api/idos-profile',
  method: 'POST',
};
