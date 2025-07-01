import { DefaultCatchBoundary } from '@/components/DefaultCatchBoundary';
import { NotFound } from '@/components/NotFound';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import WalletGate from '@/components/WalletGate';
import { CredentialsCard } from '@/components/profile/CredentialsCard';
import { IDOSClientProvider } from '@/providers/idos/idos-client';
import * as TanstackQueryProvider from '@/providers/tanstack-query/root-provider';
import * as RainbowKitProvider from '@/providers/wallet-providers/rainbow-kit';
import { useWalletGate } from '@/hooks/useWalletGate';
import type { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  Outlet,
  createRootRouteWithContext,
  createRoute,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import * as React from 'react';
import { Suspense } from 'react';
import { z } from 'zod';
import { NearWalletProvider } from './providers/wallet-providers/near-provider';
import { WalletConnectorProvider } from './providers/wallet-providers/wallet-connector';
import OnboardingStepper from './components/onboarding/OnboardingStepper';
import { useIdOSLoginStatus } from './hooks/useIdOSHasProfile';
import { StellarWalletProvider } from './providers/wallet-providers/stellar-provider';

// Root route
export const rootRoute = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <TanstackQueryProvider.Provider>
        <RainbowKitProvider.Provider>
          <NearWalletProvider>
            <StellarWalletProvider>
              <WalletConnectorProvider>
                <IDOSClientProvider>
                  <Outlet />
                  <Suspense>
                    <TanStackRouterDevtools position="bottom-right" />
                    <ReactQueryDevtools buttonPosition="bottom-left" />
                  </Suspense>
                </IDOSClientProvider>
              </WalletConnectorProvider>
            </StellarWalletProvider>
          </NearWalletProvider>
        </RainbowKitProvider.Provider>
      </TanstackQueryProvider.Provider>
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <div
        id="idOS-enclave"
        style={{
          position: 'absolute',
          width: 0,
          height: 0,
          overflow: 'hidden',
        }}
      />
    </>
  );
}

// Home route
export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

function Home() {
  const { isConnected } = useWalletGate();

  if (!isConnected) {
    return <WalletGate />;
  }

  return null;
}

// idOS Profile route
export const idosProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/idos-profile',
  component: IdosProfile,
});

export const CredentialPublicNotesSchema = z.object({
  level: z.string(),
  type: z.string(),
  status: z.string(),
  issuer: z.string(),
  id: z.string(),
  shares: z.union([z.string(), z.number()]).optional(),
});

export type CredentialPublicNotes = z.infer<typeof CredentialPublicNotesSchema>;

function IdosProfile() {
  const hasProfile = useIdOSLoginStatus();
  useWalletGate();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 p-8 pt-16 flex items-start justify-start text-idos-seasalt">
          {hasProfile ? (
            <div className="container mx-auto px-4 py-8">
              <CredentialsCard />
            </div>
          ) : (
            <div className="container mx-auto flex justify-center">
              <OnboardingStepper />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// Native Staking route
export const nativeStakingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/native-staking',
  component: NativeStaking,
});

function NativeStaking() {
  useWalletGate();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 p-8 text-idos-seasalt">
          <div>Hello "/native-staking"!</div>
        </main>
      </div>
    </div>
  );
}

// Staking Event route
export const stakingEventRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/staking-event',
  component: StakingEvent,
});

function StakingEvent() {
  useWalletGate();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 p-8 text-idos-seasalt">
          <div>Hello "/staking-event"!</div>
        </main>
      </div>
    </div>
  );
}

// Create route tree
export const routeTree = rootRoute.addChildren([
  indexRoute,
  idosProfileRoute,
  nativeStakingRoute,
  stakingEventRoute,
]);
