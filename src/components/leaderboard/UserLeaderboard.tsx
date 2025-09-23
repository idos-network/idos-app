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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full flex-col gap-6 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-800/60 p-6 ">
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
      <div className="flex h-full flex-col gap-6 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-800/60 p-6 ">
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
    <div className="flex flex-col gap-6 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-800/60 p-6 w-fit">
      <div className="overflow-x-auto">
        <table className="table-fixed text-xs font-['Inter']">
          <thead>
            <tr className="text-left text-neutral-400 text-xs bg-neutral-800 h-[44px]">
              <th className="w-[70px] px-4 font-normal rounded-l-[20px]">
                Rank
              </th>
              <th className="w-[240px] px-4 font-normal">Name</th>
              <th className="w-[110px] px-4 font-normal">Total Points</th>
              <th className="w-[110px] px-4 font-normal text-[#F1A039]">
                Quest Points
              </th>
              <th className="w-[10px] px-4 font-normal">Mindshare</th>
              <th className="w-[155px] px-4 font-normal text-[#EEFF41]">
                <span className="inline-flex items-center gap-2">
                  Social Points
                  <span className="inline-flex items-center h-4 px-2 rounded-xl bg-[#00FFB933] text-aquamarine-400 text-[10px] font-normal">
                    Soon
                  </span>
                </span>
              </th>
              <th className="w-[140px] px-4 font-normal">Total Contribution</th>
              <th className="w-[200px] px-4 font-normal text-[#2CB2FF] rounded-r-[20px]">
                <span className="inline-flex items-center gap-2">
                  Contribution Points
                  <span className="inline-flex items-center h-4 px-2 rounded-xl bg-[#00FFB933] text-aquamarine-400 text-[10px] font-normal">
                    Soon
                  </span>
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="font-[Urbanist] font-medium text-sm h-[44px] text-neutral-400">
              <td className="px-4">#{userPosition.position}</td>
              <td className="px-4 truncate">{userPosition.name}</td>
              <td className="px-4 font-light text-sm text-neutral-200">
                <div className="flex items-center">
                  <img
                    src="/idos-points-logo.png"
                    alt="Points"
                    className="w-4 h-4 mr-2"
                  />
                  {userPosition.totalPoints}
                </div>
              </td>
              <td className="px-4">{userPosition.questPoints}</td>
              <td className="px-4">-</td>
              <td className="px-4">{userPosition.socialPoints}</td>
              <td className="px-4">-</td>
              <td className="px-4">{userPosition.contributionPoints}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
