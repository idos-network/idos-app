import { NotFound } from '@/components/NotFound';
import type { QueryClient } from '@tanstack/react-query';
import {
  createRootRouteWithContext,
  createRoute,
  Outlet,
} from '@tanstack/react-router';
import AppLayout from './components/layout/AppLayout';
import { Home } from './routes/Home';
import { IdosProfile } from './routes/IdosProfile';
import { IdosStaking } from './routes/IdosStaking';
import {
  notabankBuyRoute,
  notabankIndexRoute,
  notabankKycRoute,
  notabankNotaCardRoute,
  notabankNotaCardTermsAndConditionsRoute,
  notabankOnrampRoute,
  notabankSellRoute,
} from './routes/NotaBank';
import { Points } from './routes/Points';
import { RootComponent } from './routes/RootComponent';
import { StakingEvent } from './routes/StakingEvent';

// Root route
export const rootRoute = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  errorComponent: () => <RootComponent />,
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
});

// Layout route
export const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'layout',
  component: AppLayout,
});

// Home route
export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

// idOS Profile route
export const idosProfileRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/idos-profile',
  component: IdosProfile,
});

// Native Staking route
export const idosStakingRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/idos-staking',
  component: IdosStaking,
});

// Staking Event route
export const stakingEventRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/staking-event',
  component: StakingEvent,
});

// NotaBank main route that catches all /notabank/* paths
export const notabankRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/notabank',
  component: () => (
    // Yes, this looks ugly, but it's the only way to override the font-sans class at the moment until we merge properly the styles.
    <div className="font-sans!">
      <Outlet />
    </div>
  ),
});

// Points route
export const pointsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/points',
  component: Points,
});

// Create route tree
export const routeTree = rootRoute.addChildren([
  indexRoute,
  layoutRoute.addChildren([
    idosProfileRoute,
    idosStakingRoute,
    stakingEventRoute,
    pointsRoute,
    notabankRoute.addChildren([
      notabankIndexRoute,
      notabankBuyRoute,
      notabankSellRoute,
      notabankKycRoute,
      notabankNotaCardRoute,
      notabankNotaCardTermsAndConditionsRoute,
      notabankOnrampRoute,
    ]),
  ]),
]);
