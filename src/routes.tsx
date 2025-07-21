import { DefaultCatchBoundary } from '@/components/DefaultCatchBoundary';
import { NotFound } from '@/components/NotFound';
import Header from '@/layout/Header';
import Sidebar from '@/layout/Sidebar';
import WalletGate from '@/layout/WalletGate';
import { CredentialsCard, WalletsCard } from '@/components/profile';
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
import { Suspense, useEffect } from 'react';
import { NearWalletProvider } from './providers/wallet-providers/near-provider';
import { WalletConnectorProvider } from './providers/wallet-providers/wallet-connector';
import OnboardingStepper from './components/onboarding/OnboardingStepper';
import { useIdOSLoginStatus } from './hooks/useIdOSHasProfile';
import { StellarWalletProvider } from './providers/wallet-providers/stellar-provider';
import { useSpecificCredential } from './hooks/useCredentials';
import { env } from './env';
import { ToastProvider } from '@/providers/toast/toast-provider';
import { useToast } from '@/hooks/useToast';

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
      <ToastProvider>
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
      </ToastProvider>
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

function IdosProfile() {
  const hasProfile = useIdOSLoginStatus();
  useWalletGate();
  const { hasCredential: hasStakingCredential, isLoading } =
    useSpecificCredential(env.VITE_ISSUER_SIGNING_PUBLIC_KEY);
  const { showToast } = useToast();

  useEffect(() => {
    const toastData = localStorage.getItem('showToast');
    if (toastData) {
      try {
        const { type, message } = JSON.parse(toastData);
        showToast({ type, message: message });
      } catch (e) {
        // ignore parse errors
      }
      localStorage.removeItem('showToast');
    }
  }, [showToast]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 pt-18 flex items-start justify-start text-idos-seasalt">
          {hasProfile && !isLoading && hasStakingCredential ? (
            <div className="container mx-auto max-w-[1000px] flex flex-col px-32">
              <div className="gap-3 flex flex-col mb-10">
                <div className="text-2xl font-medium text-neutral-50">
                  idOS Profile
                </div>
                <p className="text-neutral-200 text-base font-['Inter']">
                  View and manage your idOS identity and credentials
                </p>
              </div>
              <div className="flex flex-col gap-8">
                <CredentialsCard
                  onError={(err) => showToast({ type: 'error', message: err })}
                  onSuccess={(msg) =>
                    showToast({ type: 'success', message: msg })
                  }
                />
                <WalletsCard />
              </div>
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
