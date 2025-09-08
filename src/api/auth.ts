import axios from './axios';

export async function requestChallenge(address: string, walletType: 'evm'|'near'|'stellar'|'xrpl') {
  const { data } = await axios.post('/auth/challenge', { address, walletType });
  return data as { challengeToken: string; message: string; nonce: string };
}

export async function verifyLogin(params: {
  address: string;
  walletType: 'evm'|'near'|'stellar'|'xrpl';
  signature: string;
  challengeToken: string;
  public_key?: string[];
}) {
  const { data } = await axios.post('/auth/verify', params);
  return data as { token: string; refreshToken: string; userId: string };
}

export async function refreshTokens(refreshToken: string) {
  const { data } = await axios.post('/auth/refresh', { refreshToken });
  return data as { token: string; refreshToken: string; userId: string };
}

export async function logout(refreshToken: string) {
  try {
    await axios.post('/auth/logout', { refreshToken });
  } catch {}
}