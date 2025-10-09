import type { ConnectedWallet } from '@/context/wallet-connector-context';
import { env } from '@/env';
import {
  FREIGHTER_ID,
  FreighterModule,
  StellarWalletsKit,
  WalletNetwork,
  xBullModule,
} from '@creit.tech/stellar-wallets-kit';
import { StrKey } from '@stellar/stellar-base';

function getSelectedWalletId() {
  return localStorage.getItem('stellar-wallet-id');
}

export const stellarKit: StellarWalletsKit = new StellarWalletsKit({
  network:
    env.VITE_NODE_ENV === 'development'
      ? WalletNetwork.TESTNET
      : WalletNetwork.PUBLIC,
  selectedWalletId: getSelectedWalletId() ?? FREIGHTER_ID,
  modules: [new FreighterModule(), new xBullModule()],
});

export const derivePublicKey = async (address: string) => {
  if (!address) throw new Error('Address is required');
  return Buffer.from(StrKey.decodeEd25519PublicKey(address)).toString('hex');
};

export const signStellarMessage = async (
  wallet: ConnectedWallet,
  message: string,
) => {
  if (!wallet.address || !wallet.publicKey) return;
  const result = await stellarKit.signMessage(message);
  const signedMessage = Buffer.from(result.signedMessage, 'base64');
  const signatureHex = signedMessage.toString('hex');
  console.log('signatureHex', signatureHex);

  return signatureHex;
};
