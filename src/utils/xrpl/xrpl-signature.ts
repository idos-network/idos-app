import type * as GemWallet from '@gemwallet/api';

export async function signGemWalletTx(
  gemWalletInstance: typeof GemWallet,
  message: string,
): Promise<string | undefined> {
  return gemWalletInstance
    .signMessage(message)
    .then((response) => response.result?.signedMessage);
}

export async function getGemWalletPublicKey(
  wallet: typeof GemWallet,
): Promise<{ address: string; publicKey: string } | undefined> {
  if ('isInstalled' in wallet) {
    await wallet.isInstalled();
    const { publicKey, address } = await wallet
      .getPublicKey()
      .then((res) => res.result as { publicKey: string; address: string });
    return { address, publicKey };
  }
}
