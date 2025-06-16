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
import type * as React from 'react';
import { Suspense } from 'react';
import { z } from 'zod';
import OnboardingStepper from './components/onboarding/stepper';

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
          <IDOSClientProvider>
            <Outlet />
            <Suspense>
              <TanStackRouterDevtools position="bottom-right" />
              <ReactQueryDevtools buttonPosition="bottom-left" />
            </Suspense>
          </IDOSClientProvider>
        </RainbowKitProvider.Provider>
      </TanstackQueryProvider.Provider>
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>idOS Staking</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
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
      </body>
    </html>
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

// onboarding route
// TODO remove this route when onboarding becomes dependent on wallet having a created profile or not
export const onboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/onboarding',
  component: Onboarding,
});

function Onboarding() {
  useWalletGate();
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 p-8 text-idos-seasalt flex flex-col gap-8">
          <OnboardingStepper />
        </main>
      </div>
    </div>
  );
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
  useWalletGate();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 p-8 text-idos-seasalt">
          <div className="container mx-auto px-4 py-8">
            <CredentialsCard />
          </div>
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
  onboardingRoute,
  idosProfileRoute,
  nativeStakingRoute,
  stakingEventRoute,
]);
