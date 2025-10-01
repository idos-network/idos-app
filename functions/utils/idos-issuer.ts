import { idOSIssuer as idOSIssuerClass } from '@idos-network/issuer';
import nacl from 'tweetnacl';
import { type KwilSigner, NodeKwil, WebKwil } from "@idos-network/kwil-js";

export async function issuerWithKey() {
  const keys = process.env.ISSUER_SIGNING_SECRET_KEYS?.split(",").map(k => k.trim());

  if (!keys || keys.length === 0) {
    throw new Error("No issuer signing keys found in environment variable ISSUER_SIGNING_SECRET_KEYS");
  }

  const keyCount = keys.length;

  // Get a random key index
  const keyIndex = Math.floor(Math.random() * keyCount) + 1;
  console.log(`[idOS] Using key index: ${keyIndex} - ${keys[keyIndex - 1]?.slice(0, 4)}...`);

  const signingKeyPair = nacl.sign.keyPair.fromSecretKey(
    Buffer.from(keys[keyIndex - 1], 'hex'),
  );

  // Randomize the account to avoid the nonce issue
  const idOSIssuer = await idOSIssuerClass.init({
    nodeUrl: process.env.VITE_IDOS_NODE_URL as string,
    signingKeyPair,
    encryptionSecretKey: Buffer.from(
      process.env.ISSUER_ENCRYPTION_SECRET_KEY as string,
      'hex',
    ),
  });

  // TODO: Remove after the issue is solved
  const client = new NodeKwil({
    kwilProvider: process.env.VITE_IDOS_NODE_URL as string,
    chainId: "",
  });
  const account = await client.getAccount(signingKeyPair.publicKey);
  console.log("[idOS] Using account:", JSON.stringify(account));
  // TODO: Remove after the issue is solved

  return {
    keyLock: `idos_issuer_key_${keyIndex}`,
    idOSIssuer,
  }
}
