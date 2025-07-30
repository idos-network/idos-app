import { env } from '@/env';
import {
  RainbowKitProvider,
  darkTheme,
  getDefaultConfig,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { arbitrum, mainnet } from 'wagmi/chains';

const projectID = env.VITE_WALLET_CONNECT_PROJECT_ID;

const config = getDefaultConfig({
  appName: 'idOS Staking',
  projectId: projectID,
  chains: [mainnet, arbitrum],
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
        initialChain={mainnet}
      >
        {children}
      </RainbowKitProvider>
    </WagmiProvider>
  );
}
