import SmallPrimaryButton from '@/components/SmallPrimaryButton';
import Spinner from '@/components/Spinner';
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
      <div className="flex h-full flex-col gap-6 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-800/60 p-6 w-full">
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full flex-col gap-6 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-800/60 p-6 w-full">
        <div className="flex">
          <h2 className="font-normal text-xl text-neutral-50">Your Position</h2>
        </div>
        <div className="text-center text-red-500">
          Error loading your position. Please try again.
        </div>
      </div>
    );
  }

  if (!userPosition) {
    return (
      <div className="flex h-full flex-col gap-6 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-800/60 p-6 w-full">
        <div className="flex">
          <h2 className="font-normal text-xl text-neutral-50">Your Position</h2>
        </div>
        <div className="text-center text-neutral-400">
          You don't have any points yet. Complete some quests to appear on the
          leaderboard!
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-6 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-800/60 p-6 w-full">
      <div className="flex">
        <h2 className="font-normal text-xl text-neutral-50">Your Position</h2>
      </div>

      <div className="flex-grow overflow-x-auto">
        <table className="w-full table-auto text-sm font-['Inter']">
          <thead>
            <tr className="text-left text-neutral-400 text-sm bg-neutral-800 h-[52px]">
              <th className="w-[10%] px-4 font-normal rounded-l-[20px]">
                Rank
              </th>
              <th className="w-[35%] px-4 font-normal">Name</th>
              <th className="w-[15%] px-4 font-normal">Total</th>
              <th className="w-[10%] px-4 font-normal">Referrals</th>
              <th className="w-[10%] px-4 font-normal">Quest</th>
              <th className="w-[10%] px-4 font-normal">Social</th>
              <th className="w-[10%] px-4 font-normal rounded-r-[20px]">
                Contrib.
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-base h-[52px] text-neutral-200">
              <td className="px-4">{userPosition.position}</td>
              <td className="px-4 truncate">{userPosition.name}</td>
              <td className="px-4 font-medium">
                <div className="flex items-center">
                  <img
                    src="/idos-points-logo.png"
                    alt="Points"
                    className="w-4 h-4 mr-2"
                  />
                  {userPosition.totalPoints}
                </div>
              </td>
              <td className="px-4">{userPosition.referralCount}</td>
              <td className="px-4">{userPosition.questPoints}</td>
              <td className="px-4">{userPosition.socialPoints}</td>
              <td className="px-4">{userPosition.contributionPoints}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
