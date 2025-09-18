import { GeneralLeaderboard } from '@/components/leaderboard/GeneralLeaderboard';
import { UserLeaderboard } from '@/components/leaderboard/UserLeaderboard';
import Spinner from '@/components/Spinner';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { useUserId } from '@/hooks/useUserId';

export function Leaderboard() {
  const { data: userId } = useUserId();
  const { isLoading, error } = useLeaderboard({
    userId,
    limit: 5,
    offset: 0,
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-center items-center p-8">
          <Spinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center p-8 text-red-600">
          Error loading leaderboard. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <UserLeaderboard />
      <GeneralLeaderboard limit={5} offset={0} />
    </div>
  );
}
