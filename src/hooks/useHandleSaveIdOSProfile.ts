import { useNearWallet } from './useNearWallet';
import { env } from '@/env';
import { saveNewUser } from '@/storage/idos-profile';
import { signNearMessage } from '@/utils/near/near-signature';
import { signStellarMessage } from '@/utils/stellar/stellar-signature';
import { verifySignature } from '@/utils/verify-signatures';
import { ethers } from 'ethers';

export type WalletPayload = {
  address: string;
  signature: string;
  public_key: string[];
  message: string;
};

export function useHandleSaveIdOSProfile() {
  const { selector } = useNearWallet();

  return async function handleSaveIdOSProfile(
    setState: (state: string) => void,
    setLoading: (loading: boolean) => void,
    withSigner: any,
    wallet: any,
    onNext: () => void,
  ) {
    try {
      setState('idle');
      setLoading(true);
      const userId = crypto.randomUUID();

      const userEncryptionPublicKey =
        await withSigner.getUserEncryptionPublicKey(userId);

      setState('waiting_signature');

      const ownershipProofMessage = env.VITE_OWNERSHIP_PROOF_MESSAGE;

      if (!wallet?.address) {
        throw new Error('Signer address is required');
      }

      let ownershipProofSignature;
      let walletPayload: WalletPayload | null = null;
      let publicKey;
      try {
        if (wallet.type === 'near') {
          const nearWallet = await selector.wallet();
          ownershipProofSignature = await signNearMessage(
            nearWallet,
            ownershipProofMessage,
          );
          publicKey = wallet.publicKey;
          if (ownershipProofSignature) {
            walletPayload = {
              address: wallet.address,
              signature: ownershipProofSignature,
              public_key: [publicKey],
              message: ownershipProofMessage,
            };
          }
        } else if (wallet.type === 'ethereum') {
          ownershipProofSignature = await window.ethereum.request({
            method: 'personal_sign',
            params: [ownershipProofMessage, wallet.address],
          });
          if (ownershipProofSignature) {
            publicKey = ethers.SigningKey.recoverPublicKey(
              ethers.id(ownershipProofMessage),
              ownershipProofSignature,
            );
            walletPayload = {
              address: wallet.address,
              signature: ownershipProofSignature,
              public_key: [publicKey],
              message: ownershipProofMessage,
            };
          }
        } else if (wallet.type === 'stellar') {
          ownershipProofSignature = await signStellarMessage(
            wallet,
            ownershipProofMessage,
          );
          if (ownershipProofSignature) {
            publicKey = wallet.publicKey;
            walletPayload = {
              address: wallet.address,
              signature: ownershipProofSignature,
              public_key: [publicKey],
              message: ownershipProofMessage,
            };
          }
        }

        if (!walletPayload) {
          throw new Error('Failed to create wallet payload');
        }
        const verification = await verifySignature(walletPayload);
        if (!verification) {
          throw new Error('Ownership proof signature is invalid');
        }
      } catch (err: any) {
        if (err || err.code === 4001) {
          handleSaveIdOSProfile(
            setState,
            setLoading,
            withSigner,
            wallet,
            onNext,
          );
          return;
        } else {
          throw err;
        }
      }

      const savedUser = await saveNewUser({
        id: userId,
        mainAddress: wallet.address,
        userEncryptionPublicKey: userEncryptionPublicKey,
        ownershipProofSignature: ownershipProofSignature,
        publicKey: publicKey || '',
      });

      if (savedUser) {
        setState('created');
        onNext();
      } else {
        setState('idle');
      }
    } catch (error) {
      console.error('Account creation failed:', error);
      setState('idle');
      setLoading(false);
    }
  };
}
