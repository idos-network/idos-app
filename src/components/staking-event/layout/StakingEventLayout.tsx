import SmallPrimaryButton from '@/components/SmallPrimaryButton';
import { Link, Outlet, useLocation } from '@tanstack/react-router';

export function StakingEventLayout() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isOverviewActive =
    currentPath === '/staking-event' || currentPath === '/staking-event/';
  const isMyStakingsActive = currentPath === '/staking-event/my-stakings';

  return (
    <div className="space-y-6 p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-light text-white">Staking Event</h1>
        <Link to="/staking-event/stake">
          <SmallPrimaryButton>Stake</SmallPrimaryButton>
        </Link>
      </div>

      {/* Navigation Tabs */}
      <div className="relative flex gap-1 border-b border-neutral-800">
        <Link
          to="/staking-event"
          className={`relative px-4 py-3 text-base font-medium transition-colors border-b ${
            isOverviewActive
              ? 'text-white border-aquamarine-400 -mb-px z-10'
              : 'text-neutral-400 border-transparent hover:text-neutral-300'
          }`}
        >
          Overview
        </Link>
        <Link
          to="/staking-event/my-stakings"
          className={`relative px-4 py-3 text-base font-medium transition-colors border-b ${
            isMyStakingsActive
              ? 'text-white border-aquamarine-400 -mb-px z-10'
              : 'text-neutral-400 border-transparent hover:text-neutral-300'
          }`}
        >
          My Stakings
        </Link>
      </div>

      {/* Content */}
      <div>
        <Outlet />
      </div>
    </div>
  );
}
