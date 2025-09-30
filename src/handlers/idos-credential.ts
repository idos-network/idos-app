import { createIdOSCredential } from '@/api/idos-credential';
import { createDWG } from '@/api/idos-credential-dwg';
import { env } from '@/env';
import type { DWG, IdosDWG } from '@/interfaces/idos-credential';
import { signNearMessage } from '@/utils/near/near-signature';
import { signStellarMessage } from '@/utils/stellar/stellar-signature';
import { signGemWalletTx } from '@/utils/xrpl/xrpl-signature';
import * as GemWallet from '@gemwallet/api';
import type { idOSClientLoggedIn } from '@idos-network/client';
import type { Wallet as NearWallet } from '@near-wallet-selector/core';
export async function handleDWGCredential(
  setState: (state: string) => void,
  setLoading: (loading: boolean) => void,
  withSigner: idOSClientLoggedIn,
  wallet: any,
  nearWallet: NearWallet | undefined,
  signMessageAsync?: (args: { message: string }) => Promise<string>,
) {
  try {
    setState('idle');
    setLoading(true);

    //const currentTimestamp = Date.now();
    //const currentDate = new Date(currentTimestamp);
    //const notUsableAfter = new Date(currentTimestamp + 24 * 60 * 60 * 1000);

    const delegatedWriteGrant: DWG = await createDWG(wallet.type === 'xrpl' ? wallet.address : wallet.publicKey,
      env.VITE_GRANTEE_WALLET_ADDRESS,
      env.VITE_ISSUER_SIGNING_PUBLIC_KEY,
    );

    const message: string =
      await withSigner.requestDWGMessage(delegatedWriteGrant);

    setState('waiting_signature');

    let signature;
    try {
      if (wallet.type === 'evm') {
        if (!signMessageAsync) {
          throw new Error('signMessageAsync is required for EVM wallets');
        }
        signature = await signMessageAsync({
          message: message,
        });
      } else if (wallet.type === 'near') {
        signature = await signNearMessage(nearWallet!, message);
      } else if (wallet.type === 'stellar') {
        signature = await signStellarMessage(wallet, message);
      } else if (wallet.type === 'xrpl') {
        signature = await signGemWalletTx(GemWallet, message);
      }
    } catch (err: any) {
      setState('idle');
      setLoading(false);
      throw err;
    }

    if (!signature) {
      throw new Error('Signature is required');
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
