import { config } from '@/config/wagmi.config';
import { env } from '@/env';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';

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
        initialChain={env.VITE_NODE_ENV === 'development' ? sepolia : mainnet}
      >
        {children}
      </RainbowKitProvider>
    </WagmiProvider>
  );
}
