import { createIdOSProfile } from '@/api/idos-profile';
import { env } from '@/env';
import { saveNewUser } from '@/storage/idos-profile';

export async function handleSaveIdOSProfile(
  setState: (state: string) => void,
  setLoading: (loading: boolean) => void,
  withSigner: any,
  signer: any,
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

    if (!signer?.address) {
      throw new Error('Signer address is required');
    }

    let ownershipProofSignature;
    try {
      ownershipProofSignature = await window.ethereum.request({
        method: 'personal_sign',
        params: [ownershipProofMessage, signer.address],
      });
    } catch (err: any) {
      if (err.code === 4001) {
        handleSaveIdOSProfile(setState, setLoading, withSigner, signer, onNext);
        return;
      } else {
        throw err;
      }
    }

    const savedUser = await saveNewUser({
      id: userId,
      mainAddress: signer.address,
      userEncryptionPublicKey: userEncryptionPublicKey,
      ownershipProofSignature: ownershipProofSignature,
    });

    if (savedUser) {
      onNext();
    } else {
      setState('idle');
    }
  } catch (error) {
    console.error('Account creation failed:', error);
    setState('idle');
    setLoading(false);
  }
}

export async function handleCreateIdOSProfile(
  userId: string,
  userEncryptionPublicKey: string,
  userAddress: string,
  ownershipProofMessage: string,
  ownershipProofSignature: string,
) {
  try {
    const response = await createIdOSProfile(
      userId,
      userEncryptionPublicKey,
      userAddress,
      ownershipProofMessage,
      ownershipProofSignature,
    );

    if (response) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('IdOS profile creation failed:', error);
    return false;
  }
}
