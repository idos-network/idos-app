import { idOSIssuer as idOSIssuerClass } from '@idos-network/issuer';
import nacl from 'tweetnacl';

export async function issuerWithKey() {
  const keyCount = parseInt(process.env.ISSUER_SIGNING_SECRET_KEY_COUNT || "1", 10);

  // Get a random key index
  const keyIndex = Math.floor(Math.random() * keyCount) + 1;
  console.log(`Using key index: ${keyIndex}`);

  // Randomize the account to avoid the nonce issue
  const idOSIssuer = await idOSIssuerClass.init({
    nodeUrl: process.env.VITE_IDOS_NODE_URL as string,
    signingKeyPair: nacl.sign.keyPair.fromSecretKey(
      Buffer.from(process.env[`ISSUER_SIGNING_SECRET_KEY_${keyIndex}`] as string, 'hex'),
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
