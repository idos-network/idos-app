import { env } from '@/env';
import {
  RainbowKitProvider,
  darkTheme,
  getDefaultConfig,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { anvil, arbitrum, mainnet, sepolia } from 'wagmi/chains';

const projectID = env.VITE_WALLET_CONNECT_PROJECT_ID;

export const config = getDefaultConfig({
  appName: 'idOS Staking',
  projectId: projectID,
  chains: [mainnet, arbitrum, anvil, sepolia],
  ssr: true,
});

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <RainbowKitProvider
        modalSize="compact"
        theme={darkTheme({
          accentColor: '#3b3b3b',
          accentColorForeground: '#f8f8f8',
          borderRadius: 'medium',
          fontStack: 'system',
          overlayBlur: 'small',
        })}
        initialChain={sepolia} // TODO: update to mainnet
      >
        {children}
      </RainbowKitProvider>
    </WagmiProvider>
  );
}
