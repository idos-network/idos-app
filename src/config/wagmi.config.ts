import { env } from '@/env';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { anvil, arbitrum, mainnet, sepolia } from 'wagmi/chains';
import { defineChain } from 'viem';

const projectID = env.VITE_WALLET_CONNECT_PROJECT_ID;

// Define Plasma chain
const plasma = defineChain({
  id: 9745,
  name: 'Plasma',
  nativeCurrency: {
    decimals: 18,
    name: 'XPL',
    symbol: 'XPL',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.plasma.to'],
    },
  },
  blockExplorers: {
    default: { name: 'Plasma Explorer', url: 'https://explorer.plasma.to' },
  },
});

export const config = getDefaultConfig({
  appName: 'idOS Staking',
  projectId: projectID,
  chains: [mainnet, arbitrum, anvil, sepolia, plasma],
  ssr: true,
});
