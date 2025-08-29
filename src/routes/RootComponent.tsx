import { getGeoblock } from '@/api/geoblock';
import { IDOSClientProvider } from '@/providers/idos/idos-client';
import { ReferralProvider } from '@/providers/quests/referral-provider';
import * as TanstackQueryProvider from '@/providers/tanstack-query/root-provider';
import { ToastProvider } from '@/providers/toast/toast-provider';
import { NearWalletProvider } from '@/providers/wallet-providers/near-provider';
import * as RainbowKitProvider from '@/providers/wallet-providers/rainbow-kit';
import { StellarWalletProvider } from '@/providers/wallet-providers/stellar-provider';
import { WalletConnectorProvider } from '@/providers/wallet-providers/wallet-connector';
import { XrplWalletProvider } from '@/providers/wallet-providers/xrpl-provider';
import { useQuery } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import AccessRestricted from './AccessRestricted';
import { RootDocument } from './RootDocument';

export function RootComponent() {
  const { data: response } = useQuery({
    queryKey: ['geoblock'],
    queryFn: () => getGeoblock(),
  });

  if (response?.blocked) {
    return (
      <RootDocument>
        <AccessRestricted />
      </RootDocument>
    );
  }

  return (
    <RootDocument>
      <ReferralProvider>
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
      </ReferralProvider>
    </RootDocument>
  );
}
