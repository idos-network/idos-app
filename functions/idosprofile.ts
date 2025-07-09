import { idOSIssuer as idOSIssuerClass } from '@idos-network/issuer';
import nacl from 'tweetnacl';
import { ethers } from 'ethers';
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

  const idOSIssuer = idOSIssuerClass.init({
    nodeUrl: process.env.KWIL_NODE_URL as string,
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
  } = (await request.json()) as {
    userId: string;
    userEncryptionPublicKey: string;
    address: string;
    ownershipProofMessage: string;
    ownershipProofSignature: string;
  };
  const idOSIssuerInstance = await idOSIssuer;

  const user = {
    id: userId,
    recipient_encryption_public_key: userEncryptionPublicKey,
  };

  const wallet = {
    address,
    wallet_type: 'EVM',
    message: ownershipProofMessage,
    signature: ownershipProofSignature,
    public_key: ethers.SigningKey.recoverPublicKey(
      ethers.id(ownershipProofMessage),
      ownershipProofSignature,
    ),
  };

  await idOSIssuerInstance.createUser(user, wallet);

  return new Response(
    JSON.stringify({
      message: 'User created successfully',
    }),
    {
      status: 200,
    },
  );
};
