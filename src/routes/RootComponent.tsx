import { ToastProvider } from '@/providers/toast/toast-provider';
import * as TanstackQueryProvider from '@/providers/tanstack-query/root-provider';
import * as RainbowKitProvider from '@/providers/wallet-providers/rainbow-kit';
import { NearWalletProvider } from '@/providers/wallet-providers/near-provider';
import { StellarWalletProvider } from '@/providers/wallet-providers/stellar-provider';
import { XrplWalletProvider } from '@/providers/wallet-providers/xrpl-provider';
import { WalletConnectorProvider } from '@/providers/wallet-providers/wallet-connector';
import { IDOSClientProvider } from '@/providers/idos/idos-client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Outlet } from '@tanstack/react-router';
import { RootDocument } from './RootDocument';

export function RootComponent() {
  return (
    <RootDocument>
      <ToastProvider>
        <TanstackQueryProvider.Provider>
          <RainbowKitProvider.Provider>
            <NearWalletProvider>
              <StellarWalletProvider>
                <XrplWalletProvider>
                  <WalletConnectorProvider>
                    <IDOSClientProvider>
                      <Outlet />
                      <TanStackRouterDevtools position="bottom-right" />
                      <ReactQueryDevtools buttonPosition="bottom-right" />
                    </IDOSClientProvider>
                  </WalletConnectorProvider>
                </XrplWalletProvider>
              </StellarWalletProvider>
            </NearWalletProvider>
          </RainbowKitProvider.Provider>
        </TanstackQueryProvider.Provider>
      </ToastProvider>
    </RootDocument>
  );
}
