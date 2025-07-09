#!/usr/bin/env node

import nacl from 'tweetnacl';

console.log('Generating NaCl keys for idOS issuer...\n');

// Generate signing key pair (for signatures)
const signingKeyPair = nacl.sign.keyPair();
console.log(
  'signingKeyPair.secretKey',
  Buffer.from(signingKeyPair.secretKey).toString('hex'),
);
console.log(
  'signingKeyPair.publicKey',
  Buffer.from(signingKeyPair.publicKey).toString('hex'),
);

// Generate encryption key pair (for box encryption)
const encryptionKeyPair = nacl.box.keyPair();
console.log(
  'encryptionKeyPair.secretKey',
  Buffer.from(encryptionKeyPair.secretKey).toString('hex'),
);
console.log(
  'encryptionKeyPair.publicKey',
  Buffer.from(encryptionKeyPair.publicKey).toString('hex'),
);
