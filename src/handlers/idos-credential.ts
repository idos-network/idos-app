import { env } from '@/env';
import { createIdOSCredential } from '@/api/idos-credential';
import type { IdosDWG } from '@/interfaces/idos-credential';
import type { idOSClientLoggedIn } from '@idos-network/client';

export async function handleDWGCredential(
  setState: (state: string) => void,
  setLoading: (loading: boolean) => void,
  withSigner: idOSClientLoggedIn,
  signer: any,
) {
  try {
    setState('idle');
    setLoading(true);

    const currentTimestamp = Date.now();
    const currentDate = new Date(currentTimestamp);
    const notUsableAfter = new Date(currentTimestamp + 24 * 60 * 60 * 1000);
    const delegatedWriteGrant = {
      owner_wallet_identifier: await signer.getAddress(),
      grantee_wallet_identifier: env.VITE_GRANTEE_WALLET_ADDRESS,
      issuer_public_key: env.VITE_ISSUER_SIGNING_PUBLIC_KEY,
      id: crypto.randomUUID(),
      access_grant_timelock: currentDate.toISOString().replace(/.\d+Z$/g, 'Z'), // Need to cut milliseconds to have 2025-02-11T13:35:57Z datetime format
      not_usable_before: currentDate.toISOString().replace(/.\d+Z$/g, 'Z'),
      not_usable_after: notUsableAfter.toISOString().replace(/.\d+Z$/g, 'Z'),
    };

    const message: string =
      await withSigner.requestDWGMessage(delegatedWriteGrant);

    setState('waiting_signature');

    let signature;
    try {
      signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, signer.address],
      });
    } catch (err: any) {
      if (err.code === 4001) {
        return await handleDWGCredential(
          setState,
          setLoading,
          withSigner,
          signer,
        );
      } else {
        throw err;
      }
    }

    const idOSDWG: IdosDWG = {
      delegatedWriteGrant: delegatedWriteGrant,
      signature: signature,
      message: message,
    };

    return idOSDWG;
  } catch (error) {
    console.error('Credential creation failed:', error);
    throw error;
  }
}

export async function handleCreateIdOSCredential(
  idOSDWG: IdosDWG,
  userEncryptionPublicKey: string,
  userId: string,
) {
  try {
    const response = await createIdOSCredential(
      idOSDWG,
      userEncryptionPublicKey,
      userId,
    );
    if (response) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Credential issuance failed:', error);
    return false;
  }
}
