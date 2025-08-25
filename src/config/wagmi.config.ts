import { env } from '@/env';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { anvil, arbitrum, mainnet, sepolia } from 'wagmi/chains';

const projectID = env.VITE_WALLET_CONNECT_PROJECT_ID;

export const config = getDefaultConfig({
  appName: 'idOS Staking',
  projectId: projectID,
  chains: [mainnet, arbitrum, anvil, sepolia],
  ssr: true,
});
