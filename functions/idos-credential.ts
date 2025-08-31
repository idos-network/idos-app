import { type IdosDWG } from '@/interfaces/idos-credential';
import type { Config, Context } from '@netlify/functions';
// @ts-ignore
import { Ed25519VerificationKey2020 } from '@digitalbazaar/ed25519-verification-key-2020';
import { idOSIssuer as idOSIssuerClass } from '@idos-network/issuer';
import { encode as utf8Encode } from '@stablelib/utf8';
import nacl from 'tweetnacl';
import { z } from 'zod';
import { withAuth, type AuthenticatedRequest } from './middleware/auth';

// TODO: update for idOS App launch
export const IDDocumentTypeSchema = z.enum([
  'PASSPORT',
  'DRIVERS',
  'ID_CARD',
] as const);
export type IDDocumentType = z.infer<typeof IDDocumentTypeSchema>;

async function idosCredentialHandler(
  request: AuthenticatedRequest,
  _context: Context,
) {
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Method not allowed. Use POST.',
      }),
      {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }

  const { idOSDWG, userEncryptionPublicKey, userId } =
    (await request.json()) as {
      idOSDWG: IdosDWG;
      userEncryptionPublicKey: string;
      userId: string;
    };

  if (request.userId !== userId) {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Unauthorized to create credential for another user',
      }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }

  const idOSIssuer = await idOSIssuerClass.init({
    nodeUrl: process.env.IDOS_NODE_URL as string,
    signingKeyPair: nacl.sign.keyPair.fromSecretKey(
      Buffer.from(process.env.ISSUER_SIGNING_SECRET_KEY as string, 'hex'),
    ),
    encryptionSecretKey: Buffer.from(
      process.env.ISSUER_ENCRYPTION_SECRET_KEY as string,
      'hex',
    ),
  });

  const id = process.env.CREDENTIAL_ID as string;
  const issuerDomain = process.env.ISSUER_DOMAIN as string;

  const credentialFields = {
    id: `https://idOS-app/credentials/${id}`,
    level: 'human',
    issued: new Date(),
    approvedAt: new Date(),
  };

  const credentialId = crypto.randomUUID();

  // TODO: update for idOS App launch
  const credentialSubject = {
    id: `https://idOS-app/subjects/${credentialId}`,
    firstName: 'Cristiano',
    familyName: 'Ronaldo',
    dateOfBirth: new Date(),
    placeOfBirth: 'Funchal',
    idDocumentCountry: 'PT',
    idDocumentNumber: '293902002',
    idDocumentType: 'PASSPORT' as const,
    idDocumentDateOfIssue: new Date(),
    idDocumentFrontFile: Buffer.from('SOME_IMAGE'),
    selfieFile: Buffer.from('SOME_IMAGE'),
    residentialAddress: {
      street: 'Main St',
      houseNumber: '123',
      additionalAddressInfo: 'Apt 1',
      city: 'Funchal',
      postalCode: '10001',
      country: 'PT',
    },
    residentialAddressProofFile: Buffer.from('SOME_IMAGE'),
    residentialAddressProofCategory: 'UTILITY_BILL',
    residentialAddressProofDateOfIssue: new Date(),
  };

  const multibaseSigningKeyPair = await Ed25519VerificationKey2020.generate({
    id: `${issuerDomain}/keys/1`,
    controller: `${issuerDomain}/issuers/1`,
  });

  const issuer = {
    id: `${issuerDomain}/keys/1`,
    controller: `${issuerDomain}/issuers/1`,
    publicKeyMultibase: multibaseSigningKeyPair.publicKeyMultibase,
    privateKeyMultibase: multibaseSigningKeyPair.privateKeyMultibase,
  };

  const credential = await idOSIssuer.buildCredentials(
    credentialFields,
    credentialSubject,
    issuer,
  );
  const publicNotesId = crypto.randomUUID();

  const credentialsPublicNotes = {
    // `id` is required to make `editCredential` work.
    id: publicNotesId,
    type: 'PoP',
    level: 'human',
    status: 'approved',
    issuer: 'idOS',
  };

  const credentialContent = JSON.stringify(credential);

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

  const credentialPayload = {
    id: crypto.randomUUID(),
    user_id: userId,
    plaintextContent: utf8Encode(credentialContent),
    recipientEncryptionPublicKey: recipientEncryptionPublicKey,
    publicNotes: JSON.stringify(credentialsPublicNotes),
  };

  const result = await idOSIssuer.createCredentialByDelegatedWriteGrant(
    credentialPayload,
    {
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
    },
  );

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export default withAuth(idosCredentialHandler);

export const config: Config = {
  path: '/api/idos-credential',
  method: 'POST',
};
