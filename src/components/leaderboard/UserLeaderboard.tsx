import SmallPrimaryButton from '@/components/SmallPrimaryButton';
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { useUserId } from '@/hooks/useUserId';
import { idosProfileRoute } from '@/routes';
import { Link } from '@tanstack/react-router';

export function UserLeaderboard() {
  const { data: userId } = useUserId();
  const { userPosition, isLoading, error } = useLeaderboard({
    userId,
  });

  if (!userId) {
    return (
      <div className="flex h-full flex-col gap-6 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-800/60 p-6 ">
        <div className="flex">
          <h2 className="font-normal text-xl text-neutral-50">Your Position</h2>
        </div>
        <div className="flex flex-col gap-4 justify-center items-center">
          <div className="text-center text-neutral-400">
            Please complete the onboarding process to view your leaderboard
            position.
          </div>
          <div>
            <Link to={idosProfileRoute.to}>
              <SmallPrimaryButton>Complete Onboarding</SmallPrimaryButton>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const emptyState = (
    <div className="text-center text-neutral-400">
      You don't have any points yet. Complete some quests to appear on the
      leaderboard!
    </div>
  );

  const errorState = (
    <div className="text-center text-red-500">
      Error loading your position. Please try again.
    </div>
  );

  return (
    <LeaderboardTable
      data={userPosition ? [userPosition] : []}
      isLoading={isLoading}
      error={error}
      emptyState={emptyState}
      errorState={errorState}
    />
  );
}
