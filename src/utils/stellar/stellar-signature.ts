import type { ConnectedWallet } from '@/providers/wallet-providers/wallet-connector';
import {
  FREIGHTER_ID,
  FreighterModule,
  StellarWalletsKit,
  WalletNetwork,
  xBullModule,
} from '@creit.tech/stellar-wallets-kit';
import { StrKey } from '@stellar/stellar-base';
import { KwilSigner } from '@kwilteam/kwil-js';

function getSelectedWalletId() {
  return localStorage.getItem('stellar-wallet-id');
}

export const stellarKit: StellarWalletsKit = new StellarWalletsKit({
  // @todo: pass ENV variable here
  network: WalletNetwork.TESTNET,
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
  // Encode the message as base64 (stellarKit expects this)
  const messageBase64 = Buffer.from(message).toString('base64');

  const result = await stellarKit.signMessage(messageBase64);

  let signedMessage = Buffer.from(result.signedMessage, 'base64');

  if (signedMessage.length > 64) {
    signedMessage = Buffer.from(signedMessage.toString(), 'base64');
  }

  const signatureHex = signedMessage.toString('hex');

  return signatureHex;
};

export const createStellarSigner = async (
  walletPublicKey: string,
  walletAddress: string,
) => {
  const stellarSigner = new KwilSigner(
    async (msg: Uint8Array): Promise<Uint8Array> => {
      const messageBase64 = Buffer.from(msg).toString('base64');
      const result = await stellarKit.signMessage(messageBase64);

      let signedMessage = Buffer.from(result.signedMessage, 'base64');

      if (signedMessage.length > 64) {
        signedMessage = Buffer.from(signedMessage.toString(), 'base64');
      }
      return signedMessage;
    },
    walletPublicKey as string,
    'ed25519',
  );
  try {
    // @ts-expect-error publicAddress is not typed
    stellarSigner.publicAddress = walletAddress;
  } catch (error) {
    console.error('error setting public address', error);
  }
  return stellarSigner;
};
