import { useIdOS } from '@/context/idos-context';
import type { ConnectedWallet } from '@/context/wallet-connector-context';
import { env } from '@/env';
import { saveNewUserToLocalStorage } from '@/storage/idos-profile';
import { signNearMessage } from '@/utils/near/near-signature';
import { signStellarMessage } from '@/utils/stellar/stellar-signature';
import { verifySignature } from '@/utils/verify-signatures';
import { signGemWalletTx } from '@/utils/xrpl/xrpl-signature';
import * as GemWallet from '@gemwallet/api';
import { useMutation } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { useSignMessage } from 'wagmi';
import { useNearWallet } from './useNearWallet';

export type WalletPayload = {
  address: string;
  signature: string;
  public_key: string[];
  message: string;
};

export function useHandleSaveIdOSProfile({
  onNext,
  wallet,
  setState,
  setLoading,
}: {
  onNext: () => void;
  wallet: ConnectedWallet | null;
  setState: (state: string) => void;
  setLoading: (loading: boolean) => void;
}) {
  const { selector } = useNearWallet();
  const { signMessageAsync } = useSignMessage();
  const { idOSClient } = useIdOS();

  return useMutation({
    mutationFn: async () => {
      if (idOSClient.state !== 'with-user-signer' || !wallet) return;
      setState('idle');
      setLoading(true);

      const userId = crypto.randomUUID();
      const encryptionProfile =
        await idOSClient.createUserEncryptionProfile(userId);

      const ownershipProofMessage = env.VITE_OWNERSHIP_PROOF_MESSAGE;

      let ownershipProofSignature;
      let walletPayload: WalletPayload | null = null;
      let publicKey;

      setState('waiting_signature');

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
          encryptionPasswordStore: 'user' as const,
          ownershipProofSignature: ownershipProofSignature as string,
          publicKey: publicKey as string,
        };

        const savedUser = saveNewUserToLocalStorage(userPayload);

        Promise.resolve(savedUser);
      } catch (error) {
        console.error('Account creation failed:', error);
        setState('idle');
        setLoading(false);
      }
    },
    onSuccess: () => {
      setState('created');
      onNext();
    },
    onError: () => {
      setState('idle');
    },
  });

  // return async function handleSaveIdOSProfile(
  //   setState: (state: string) => void,
  //   setLoading: (loading: boolean) => void,
  //   withSigner: any,
  //   wallet: any,
  //   onNext: () => void,
  // ) {
  //   try {
  //     setState('idle');
  //     setLoading(true);
  //     const userId = crypto.randomUUID();
  //     if (!('createUserEncryptionProfile' in withSigner)) return

  //     const encryptionProfile =
  //       await withSigner.createUserEncryptionProfile(userId);

  //     setState('waiting_signature');

  //     const ownershipProofMessage = env.VITE_OWNERSHIP_PROOF_MESSAGE;

  //     if (!wallet?.address) {
  //       throw new Error('Signer address is required');
  //     }

  //     let ownershipProofSignature;
  //     let walletPayload: WalletPayload | null = null;
  //     let publicKey;
  //     try {
  //       if (wallet.type === 'near') {
  //         const nearWallet = await selector.wallet();
  //         ownershipProofSignature = await signNearMessage(
  //           nearWallet,
  //           ownershipProofMessage,
  //         );
  //         publicKey = wallet.publicKey;
  //         if (ownershipProofSignature) {
  //           walletPayload = {
  //             address: wallet.address,
  //             signature: ownershipProofSignature,
  //             public_key: [publicKey],
  //             message: ownershipProofMessage,
  //           };
  //         }
  //       } else if (wallet.type === 'evm') {
  //         ownershipProofSignature = await signMessageAsync({
  //           message: ownershipProofMessage,
  //         });
  //         if (ownershipProofSignature) {
  //           publicKey = ethers.SigningKey.recoverPublicKey(
  //             ethers.id(ownershipProofMessage),
  //             ownershipProofSignature,
  //           );
  //           walletPayload = {
  //             address: wallet.address,
  //             signature: ownershipProofSignature,
  //             public_key: [publicKey],
  //             message: ownershipProofMessage,
  //           };
  //         }
  //       } else if (wallet.type === 'stellar') {
  //         ownershipProofSignature = await signStellarMessage(
  //           wallet,
  //           ownershipProofMessage,
  //         );
  //         if (ownershipProofSignature) {
  //           publicKey = wallet.publicKey;
  //           walletPayload = {
  //             address: wallet.address,
  //             signature: ownershipProofSignature,
  //             public_key: [publicKey],
  //             message: ownershipProofMessage,
  //           };
  //         }
  //       } else if (wallet.type === 'xrpl') {
  //         ownershipProofSignature = await signGemWalletTx(
  //           GemWallet,
  //           ownershipProofMessage,
  //         );
  //         if (ownershipProofSignature) {
  //           publicKey = wallet.publicKey;
  //           walletPayload = {
  //             address: wallet.address,
  //             signature: ownershipProofSignature,
  //             public_key: [publicKey],
  //             message: ownershipProofMessage,
  //           };
  //         }
  //       }

  //       if (!walletPayload) {
  //         throw new Error('Failed to create wallet payload');
  //       }
  //       const verification = await verifySignature(walletPayload);
  //       if (!verification) {
  //         throw new Error('Ownership proof signature is invalid');
  //       }
  //     } catch (err: any) {
  //       if (err || err.code === 4001) {
  //         handleSaveIdOSProfile(
  //           setState,
  //           setLoading,
  //           withSigner,
  //           wallet,
  //           onNext,
  //         );
  //         return;
  //       } else {
  //         throw err;
  //       }
  //     }

  //     const userPayload = {
  //       id: userId,
  //       mainAddress: wallet.address,
  //       userEncryptionPublicKey:
  //         encryptionProfile.userEncryptionPublicKey as string,
  //       encryptionPasswordStore: 'user' as const,
  //       ownershipProofSignature: ownershipProofSignature as string,
  //       publicKey: publicKey,
  //     };

  //     const savedUser = saveNewUserToLocalStorage(userPayload);

  //     if (savedUser) {
  //       setState('created');
  //       onNext();
  //     } else {
  //       setState('idle');
  //     }
  //   } catch (error) {
  //     console.error('Account creation failed:', error);
  //     setState('idle');
  //     setLoading(false);
  //   }
  // };
}
