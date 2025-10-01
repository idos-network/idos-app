import { getUserById, setUserPopCredentialId } from '@/db/user';
import { type IdosDWG } from '@/interfaces/idos-credential';
import type { Config, Context } from '@netlify/functions';
import { encode as utf8Encode } from '@stablelib/utf8';
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
    );
  }

  const pool = new Pool({ connectionString: process.env.NETLIFY_DATABASE_URL });
  const db = drizzle(pool);

  pool.on("error", (err) => {
    Sentry.captureException(err);
    console.error("Unexpected error on idle client", err);
  });

  try {
    const { idOSDWG, userEncryptionPublicKey, userId } =
      (await request.json()) as {
        idOSDWG: IdosDWG;
        userEncryptionPublicKey: string;
        userId: string;
      };

    const user = await getUserById(userId).then((res) => res[0]);

    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'User not found.',
        }),
        { status: 404 },
      );
    }

    Sentry.setUser({ id: userId });

    if (!user.faceSignUserId || user.popCredentialsId) {
      return new Response(
        JSON.stringify({
          success: false,
          message:
            'User is in invalid state (did not complete face sign, or already has POP credentials).',
        }),
        { status: 400 },
      );
    }

    let issuerDomain = process.env.FACETEC_SERVER as string;
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

    const { keyLock, idOSIssuer, getAccount } = await issuerWithKey();

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

    await db.transaction(async (tx: any) => {
      // https://neon.com/guides/rate-limiting
      await tx.execute(
        sql`SELECT pg_advisory_xact_lock(hashtext(${keyLock}))`
      );

      try {
        console.log("[idos-credential] Using account:", JSON.stringify(await getAccount()));

        const result = await idOSIssuer.createCredentialByDelegatedWriteGrant(
          credentialParams,
          dwgParams,
        );

        if (!result.originalCredential.id) {
          console.log(result);
          throw new Error('Credential creation failed');
        }

        await setUserPopCredentialId(userId, result.originalCredential.id);
      } catch (e) {
        console.log('DWG params on error:', dwgParams);
        throw e;
      }
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Credential created successfully',
      }),
      { status: 200 },
    );
  } catch (err) {
    Sentry.captureException(err);
    console.log(err);

    return new Response(
      JSON.stringify({
        success: false,
        message: 'An error occurred while creating the credential.',
      }),
      { status: 500 },
    );
  }
  finally {
    // Ensure pool is closed after request
    context.waitUntil(pool.end());
  }
});

export const config: Config = {
  path: '/api/idos-credential',
  method: 'POST',
};
