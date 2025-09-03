import { NotFound } from '@/components/NotFound';
import { isProduction } from '@/env';
import type { QueryClient } from '@tanstack/react-query';
import {
  createRootRouteWithContext,
  createRoute,
  Outlet,
} from '@tanstack/react-router';
import { FaceTecExample } from './components/FaceTecExample';
import AppLayout from './components/layout/AppLayout';
import NotaBankLogo from './components/NotaBank/components/NotaBankLogo';
import { StakingEventLayout } from './components/staking-event/layout/StakingEventLayout';
import { Stake } from './components/staking-event/views/Stake';
import { Home } from './routes/Home';
import { IdosIco } from './routes/IdosIco';
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
import {
  stakingEventIndexRoute,
  stakingEventMyStakingsRoute,
} from './routes/StakingEvent';

// Root route
export const rootRoute = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  errorComponent: () => <>Some error happened {':('}</>,
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

// NotaBank main route that catches all /notabank/* paths
export const notabankRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/notabank',
  component: () => (
    // Yes, this looks ugly, but it's the only way to override the font-sans class at the moment until we merge properly the styles.
    <div className="font-sans!">
      <NotaBankLogo />
      <Outlet />
    </div>
  ),
});

// Staking Event route
export const stakingEventRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/staking-event',
  component: StakingEventLayout,
});

// Standalone Stake route
export const stakingEventStakeRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/staking-event/stake',
  component: Stake,
});

// IDOS ICO route
export const idosIcoRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/idos-ico',
  component: IdosIco,
});

// IDOS Staking route
export const idosStakingRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/idos-staking',
  component: IdosStaking,
});

// Points route
export const pointsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/points',
  component: Points,
});

// FaceTec Example route
export const faceTecExampleRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/face-tec-example',
  component: FaceTecExample,
});

// Create route tree
export const routeTree = rootRoute.addChildren([
  indexRoute,
  layoutRoute.addChildren([
    idosProfileRoute,
    ...(isProduction
      ? []
      : [
          notabankRoute.addChildren([
            notabankIndexRoute,
            notabankBuyRoute,
            notabankSellRoute,
            notabankKycRoute,
            notabankNotaCardRoute,
            notabankNotaCardTermsAndConditionsRoute,
            notabankOnrampRoute,
          ]),
          stakingEventRoute.addChildren([
            stakingEventIndexRoute,
            stakingEventMyStakingsRoute,
          ]),
          stakingEventStakeRoute,
        ]),

    idosIcoRoute,
    idosStakingRoute,
    pointsRoute,
    faceTecExampleRoute,
  ]),
]);
