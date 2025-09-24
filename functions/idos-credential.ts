import { getUserById, setUserPopCredentialId } from '@/db/user';
import { type IdosDWG } from '@/interfaces/idos-credential';
import { idOSIssuer as idOSIssuerClass } from '@idos-network/issuer';
import type { Config, Context } from '@netlify/functions';
import { encode as utf8Encode } from '@stablelib/utf8';
import nacl from 'tweetnacl';

export default async (request: Request, _context: Context) => {
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Method not allowed. Use POST.',
      }),
    );
  }

  const { idOSDWG, userEncryptionPublicKey, userId } =
    (await request.json()) as {
      idOSDWG: IdosDWG;
      userEncryptionPublicKey: string;
      userId: string;
    };

  const user = await getUserById(userId).then(res => res[0]);

  if (!user) {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'User not found.',
      }),
      { status: 404 },
    );
  }

  if (!user.faceSignUserId || user.popCredentialsId) {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'User is in invalid state (did not complete face sign, or already has POP credentials).',
      }),
      { status: 400 },
    );
  }

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

  let issuerDomain = process.env.ISSUER_DOMAIN as string;
  if (issuerDomain.endsWith('/')) {
    issuerDomain = issuerDomain.slice(0, -1);
  }

  const credentialFields = {
    id: `${issuerDomain}/credentials/${user.faceSignUserId}`,
    level: 'human',
    issued: new Date(),
    approvedAt: new Date(),
  };

  const issuer = {
    issuer: `${issuerDomain}/idos`,
    publicKeyMultibase: process.env.ISSUER_PUBLIC_KEY_MULTIBASE as string,
    privateKeyMultibase: process.env.ISSUER_PRIVATE_KEY_MULTIBASE as string,
  };

  const plainContent = await idOSIssuer.buildFaceIdCredential(
    credentialFields,
    {
      faceSignUserId: user.faceSignUserId,
    },
    issuer,
  );

  const publicNotes = {
    // `id` is required to make `editCredential` work.
    id: crypto.randomUUID(),
    type: 'PoP',
    level: 'human',
    status: 'approved',
    issuer: 'FaceSign',
  };

  if (!userEncryptionPublicKey) {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'User encryption public key is required.',
      }),
      { status: 400 },
    );
  }

  const recipientEncryptionPublicKey = Buffer.from(
    userEncryptionPublicKey,
    'base64',
  );

  const credentialParams = {
    publicNotes: JSON.stringify(publicNotes),
    plaintextContent: utf8Encode(JSON.stringify(plainContent)),
    recipientEncryptionPublicKey: recipientEncryptionPublicKey,
  };

  const dwgParams = {
    id: idOSDWG.delegatedWriteGrant.id,
    ownerWalletIdentifier:
      idOSDWG.delegatedWriteGrant.owner_wallet_identifier,
    consumerWalletIdentifier:
      idOSDWG.delegatedWriteGrant.grantee_wallet_identifier,
    issuerPublicKey: idOSDWG.delegatedWriteGrant.issuer_public_key,
    accessGrantTimelock: idOSDWG.delegatedWriteGrant.access_grant_timelock,
    notUsableBefore: idOSDWG.delegatedWriteGrant.not_usable_before,
    notUsableAfter: idOSDWG.delegatedWriteGrant.not_usable_after,
    signature: idOSDWG.signature,
  };

  const result = await idOSIssuer.createCredentialByDelegatedWriteGrant(
    credentialParams,
    dwgParams,
  );

  await setUserPopCredentialId(userId, result.originalCredential.id);

  return new Response(JSON.stringify(result), { status: 200 });
};

export const config: Config = {
  path: '/api/idos-credential',
  method: 'POST',
};
