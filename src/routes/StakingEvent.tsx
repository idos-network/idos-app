import { MyStakings } from '@/components/staking-event/views/MyStakings';
import { Overview } from '@/components/staking-event/views/Overview';
import { stakingEventRoute } from '@/routes';
import { createRoute } from '@tanstack/react-router';

// Landing route for /staking-event
export const stakingEventIndexRoute = createRoute({
  getParentRoute: () => stakingEventRoute,
  path: '/',
  component: Overview,
});

// My Stakings route for /staking-event/my-stakings
export const stakingEventMyStakingsRoute = createRoute({
  getParentRoute: () => stakingEventRoute,
  path: '/my-stakings',
  component: MyStakings,
});
