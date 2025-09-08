import { requestChallenge, verifyLogin } from '@/api/auth';
import { setAccessToken, setRefreshToken } from '@/storage/auth';

export type WalletLoginParams = {
  address: string;
  walletType: 'evm'|'near'|'stellar'|'xrpl';
  signMessage: (message: string) => Promise<string>;
  public_key?: string[]; // required for near/stellar/xrpl
};

export async function loginBackend({ address, walletType, signMessage, public_key }: WalletLoginParams) {
  const { message, challengeToken } = await requestChallenge(address, walletType);
  const signature = await signMessage(message);
  const { token, refreshToken } = await verifyLogin({
    address,
    walletType,
    signature,
    challengeToken,
    public_key,
  });
  setAccessToken(token);
  setRefreshToken(refreshToken);
}