import { NotFound } from '@/components/NotFound';
import type { QueryClient } from '@tanstack/react-query';
import {
  createRootRouteWithContext,
  createRoute,
  Outlet,
} from '@tanstack/react-router';
import { RootComponent } from './routes/RootComponent';
import { Home } from './routes/Home';
import { IdosProfile } from './routes/IdosProfile';
import { IdosStaking } from './routes/IdosStaking';
import { StakingEvent } from './routes/StakingEvent';
import {
  notabankIndexRoute,
  notabankBuyRoute,
  PageLayout,
  notabankKycRoute,
  notabankNotaCardRoute,
} from './routes/NotaBank';

// Root route
export const rootRoute = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  errorComponent: () => <RootComponent />,
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
});

// Home route
export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

// idOS Profile route
export const idosProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/idos-profile',
  component: IdosProfile,
});

// Native Staking route
export const idosStakingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/idos-staking',
  component: IdosStaking,
});

// Staking Event route
export const stakingEventRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/staking-event',
  component: StakingEvent,
});

// NotaBank main route that catches all /notabank/* paths
export const notabankRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/notabank',
  component: () => (
    <PageLayout>
      {' '}
      <Outlet />{' '}
    </PageLayout>
  ), // This will render child routes
});

// Create route tree
export const routeTree = rootRoute.addChildren([
  indexRoute,
  idosProfileRoute,
  idosStakingRoute,
  stakingEventRoute,
  notabankRoute,
  notabankIndexRoute,
  notabankBuyRoute,
  notabankKycRoute,
  notabankNotaCardRoute,
]);
