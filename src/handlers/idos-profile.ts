import { createIdOSProfile } from '@/api/idos-profile';

export async function handleCreateIdOSProfile(payload: {
  userId: string;
  userEncryptionPublicKey: string;
  userAddress: string;
  ownershipProofMessage: string;
  ownershipProofSignature: string;
  publicKey: string;
  walletType: string;
  encryptionPasswordStore: string;
}) {
  const {
    userId,
    userEncryptionPublicKey,
    userAddress,
    ownershipProofMessage,
    ownershipProofSignature,
    publicKey,
    walletType,
    encryptionPasswordStore,
  } = payload;
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
  if (!response) throw new Error('Failed to create idOS profile');
  return response;
}
