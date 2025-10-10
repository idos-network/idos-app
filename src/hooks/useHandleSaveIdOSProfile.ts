import { saveUserUnauth } from '@/api/user';
import { useIdOS } from '@/context/idos-context';
import type { ConnectedWallet } from '@/context/wallet-connector-context';
import { env } from '@/env';
import { saveNewUserToLocalStorage } from '@/storage/idos-profile';
import { signNearMessage } from '@/utils/near/near-signature';
import { signStellarMessage } from '@/utils/stellar/stellar-signature';
import {
  verifySignature,
  type WalletSignature,
} from '@idos-network/utils/crypto/signature-verification';
import { signGemWalletTx } from '@/utils/xrpl/xrpl-signature';
import * as GemWallet from '@gemwallet/api';
import { useMutation } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { useSignMessage } from 'wagmi';
import { useNearWallet } from './useNearWallet';
import { lookLikeAnEvmAddress } from '@/components/NotaBank/components/LegacyUsersMigrator';

export function useHandleSaveIdOSProfile({
  onNext,
  wallet,
  setState,
}: {
  onNext: () => void;
  wallet: ConnectedWallet | null;
  setState: (state: string) => void;
}) {
  const { selector } = useNearWallet();
  const { signMessageAsync } = useSignMessage();
  const { idOSClient } = useIdOS();

  return useMutation({
    mutationFn: async () => {
      if (!idOSClient) return;
      if (idOSClient.state !== 'with-user-signer' || !wallet) return;
      console.log('CREATE IDOS PROFILE', { idOSClient, wallet });
      setState('idle');
      const userId = crypto.randomUUID();
      const encryptionProfile =
        await idOSClient.createUserEncryptionProfile(userId);

      const ownershipProofMessage = env.VITE_OWNERSHIP_PROOF_MESSAGE;

      let ownershipProofSignature;
      let walletPayload: WalletSignature | null = null;
      let publicKey;

      setState('waiting_signature');

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
            public_key: [publicKey as string],
            message: ownershipProofMessage,
          };
        }
      } else if (wallet.type === 'evm') {
        ownershipProofSignature = await signMessageAsync({
          message: ownershipProofMessage,
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
        console.log('ownershipProofSignature', ownershipProofSignature);
        if (ownershipProofSignature) {
          publicKey = wallet.publicKey;
          walletPayload = {
            address: wallet.address,
            signature: ownershipProofSignature,
            public_key: [publicKey as string],
            message: ownershipProofMessage,
          };
        }
      } else if (wallet.type === 'xrpl') {
        ownershipProofSignature = await signGemWalletTx(
          GemWallet,
          ownershipProofMessage,
        );
        if (ownershipProofSignature) {
          publicKey = wallet.publicKey;
          walletPayload = {
            address: wallet.address,
            signature: ownershipProofSignature,
            public_key: [publicKey as string],
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

      const userPayload = {
        id: userId as string,
        mainAddress: wallet.address as string,
        userEncryptionPublicKey:
          encryptionProfile.userEncryptionPublicKey as string,
        encryptionPasswordStore: (encryptionProfile.encryptionPasswordStore ??
          'user') as string,
        ownershipProofSignature: ownershipProofSignature as string,
        publicKey: publicKey as string,
      };

      const savedUser = saveNewUserToLocalStorage(userPayload);
      // initial save for the user info (mainly the id, for faceSign completion tracking)
      await saveUserUnauth({
        id: userId,
        mainEvm: lookLikeAnEvmAddress(wallet.address) ? wallet.address : '',
      });

      Promise.resolve(savedUser);
    },
    onSuccess: () => {
      setState('created');
      onNext();
    },
    onError: () => {
      setState('idle');
    },
  });
}
