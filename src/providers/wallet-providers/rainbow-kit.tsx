import { config } from '@/config/wagmi.config';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { sepolia } from 'wagmi/chains';

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
