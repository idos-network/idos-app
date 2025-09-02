import { createIdOSProfile } from '@/api/idos-profile';

export async function handleCreateIdOSProfile(
  userId: string,
  userEncryptionPublicKey: string,
  userAddress: string,
  ownershipProofMessage: string,
  ownershipProofSignature: string,
  publicKey: string,
  walletType: string,
  encryptionPasswordStore: string,
) {
  try {
    const response = await createIdOSProfile(
      userId,
      userEncryptionPublicKey,
      userAddress,
      ownershipProofMessage,
      ownershipProofSignature,
      publicKey,
      walletType,
      encryptionPasswordStore,
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
