import Spinner from '@/components/Spinner';
import { useLeaderboard } from '@/hooks/useLeaderboard';

interface GeneralLeaderboardProps {
  limit?: number;
  offset?: number;
}

export function GeneralLeaderboard({
  limit = 5,
  offset = 0,
}: GeneralLeaderboardProps) {
  const { leaderboard, isLoading, error } = useLeaderboard({
    limit,
    offset,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600">
        Error loading leaderboard. Please try again.
      </div>
    );
  }

  if (!leaderboard || leaderboard.length === 0) {
    return (
      <div className="text-center p-8 text-gray-600">
        No leaderboard data available.
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-6 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-800/60 p-6 w-full">
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
            {leaderboard.map((item, index) => {
              const isLastRow = index === leaderboard.length - 1;
              return (
                <tr
                  key={item.name}
                  className={`text-base h-[52px] ${!isLastRow ? 'border-neutral-800 border-b' : ''} text-neutral-200`}
                >
                  <td className="px-4">{item.position}</td>
                  <td className="px-4 truncate">{item.name}</td>
                  <td className="px-4 font-medium">
                    <div className="flex items-center">
                      <img
                        src="/idos-points-logo.png"
                        alt="Points"
                        className="w-4 h-4 mr-2"
                      />
                      {item.totalPoints}
                    </div>
                  </td>
                  <td className="px-4">{item.referralCount}</td>
                  <td className="px-4">{item.questPoints}</td>
                  <td className="px-4">{item.socialPoints}</td>
                  <td className="px-4">{item.contributionPoints}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
