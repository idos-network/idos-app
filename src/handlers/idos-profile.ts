import { createIdOSProfile } from '@/api/idos-profile';

export async function handleCreateIdOSProfile(
  userId: string,
  userEncryptionPublicKey: string,
  encryptionPasswordStore: string,
  userAddress: string,
  ownershipProofMessage: string,
  ownershipProofSignature: string,
  publicKey: string,
  walletType: string,
) {
  try {
    const response = await createIdOSProfile(
      userId,
      userEncryptionPublicKey,
      encryptionPasswordStore,
      userAddress,
      ownershipProofMessage,
      ownershipProofSignature,
      publicKey,
      walletType,
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
