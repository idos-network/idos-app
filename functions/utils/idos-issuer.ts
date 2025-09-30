import { idOSIssuer as idOSIssuerClass } from '@idos-network/issuer';
import nacl from 'tweetnacl';

export async function issuerWithKey(publicKey?: string) {
  const keys = process.env.ISSUER_SIGNING_SECRET_KEYS?.split(",").map(k => k.trim());
  const publicKeys = process.env.VITE_ISSUER_SIGNING_PUBLIC_KEYS?.split(',').map(k => k.trim());

  if (!publicKeys || publicKeys.length === 0) {
    throw new Error("VITE_ISSUER_SIGNING_PUBLIC_KEYS is not set");
  }

  if (publicKey && !publicKeys.includes(publicKey)) {
    throw new Error("Provided public key is not in the list of allowed public keys");
  }

  if (!keys || keys.length === 0) {
    throw new Error("No issuer signing keys found in environment variable ISSUER_SIGNING_SECRET_KEYS");
  }

  const keyCount = keys.length;

  // For public key we have to choose the same index as in public keys array
  const keyIndex = publicKey ? publicKeys.indexOf(publicKey) + 1 : Math.floor(Math.random() * keyCount) + 1;
  console.log(`[idOS] Using key index: ${keyIndex} - ${keys[keyIndex - 1]?.slice(0, 4)}...`);

  // Randomize the account to avoid the nonce issue
  const idOSIssuer = await idOSIssuerClass.init({
    nodeUrl: process.env.VITE_IDOS_NODE_URL as string,
    signingKeyPair: nacl.sign.keyPair.fromSecretKey(
      Buffer.from(keys[keyIndex - 1], 'hex'),
    ),
    encryptionSecretKey: Buffer.from(
      process.env.ISSUER_ENCRYPTION_SECRET_KEY as string,
      'hex',
    ),
  });

  return {
    keyLock: `idos_issuer_key_${keyIndex}`,
    idOSIssuer,
  }
}
