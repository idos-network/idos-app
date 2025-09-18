import { getLeaderboard, type LeaderboardEntryData } from '@/api/leaderboard';
import { useQuery } from '@tanstack/react-query';

interface UseLeaderboardOptions {
  limit?: number;
  offset?: number;
  userId?: string;
}

interface UseLeaderboardResult {
  leaderboard: LeaderboardEntryData[];
  userPosition: LeaderboardEntryData | null;
  isLoading: boolean;
  error: any;
}

export const useLeaderboard = ({
  limit = 10,
  offset = 0,
  userId,
}: UseLeaderboardOptions = {}): UseLeaderboardResult => {
  const {
    data: allData,
    isLoading,
    error,
  } = useQuery<LeaderboardEntryData[]>({
    queryKey: ['leaderboard', 'complete'],
    queryFn: () => getLeaderboard(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (!allData) {
    return {
      leaderboard: [],
      userPosition: null,
      isLoading,
      error,
    };
  }

  const userPosition = userId
    ? allData.find((entry) => entry.userId === userId) || null
    : null;

  const leaderboard = allData.slice(offset, offset + limit);

  return {
    leaderboard,
    userPosition,
    isLoading,
    error,
  };
};
