import { getLeaderboard, type LeaderboardEntryData } from '@/api/leaderboard';
import { useQuery } from '@tanstack/react-query';

export function Leaderboard() {
  const { data } = useQuery<LeaderboardEntryData[]>({
    queryKey: ['leaderboard'],
    queryFn: () => getLeaderboard({ limit: 5, offset: 0 }),
  });

  return (
    <div>
      <div>Leaderboard</div>
      <div>
        {data?.map((item) => (
          <div key={item.userId} className="mb-2 p-2 border rounded">
            <div className="font-semibold">
              {item.position}. {item.userId} - {item.totalPoints} total points
            </div>
            <div className="text-sm text-gray-600">
              Quest: {item.questPoints} | Social: {item.socialPoints} |
              Contribution: {item.contributionPoints} | Referrals:{' '}
              {item.referralCount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
