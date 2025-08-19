import { MyStakings } from '@/components/staking-event/views/MyStakings';
import { Overview } from '@/components/staking-event/views/Overview';
import { Stake } from '@/components/staking-event/views/Stake';
import { stakingEventRoute } from '@/routes';
import { createRoute } from '@tanstack/react-router';

// Landing route for /staking-event
export const stakingEventIndexRoute = createRoute({
  getParentRoute: () => stakingEventRoute,
  path: '/',
  component: Overview,
});

// Stake route for /staking-event/my-stakings
export const stakingEventMyStakingsRoute = createRoute({
  getParentRoute: () => stakingEventRoute,
  path: '/my-stakings',
  component: MyStakings,
});

export const stakingEventStakeRoute = createRoute({
  getParentRoute: () => stakingEventRoute,
  path: '/stake',
  component: Stake,
});
