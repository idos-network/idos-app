import {
  getLeaderboard,
  getUserPosition,
  type LeaderboardEntryData,
} from '@/api/leaderboard';
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
    isLoading: leaderboardLoading,
    error: leaderboardError,
  } = useQuery<LeaderboardEntryData[]>({
    queryKey: ['leaderboard', 'complete'],
    queryFn: () => getLeaderboard(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const {
    data: userPosition,
    isLoading: userPositionLoading,
    error: userPositionError,
  } = useQuery<LeaderboardEntryData | null>({
    queryKey: ['leaderboard', 'userPosition', userId],
    queryFn: () => getUserPosition(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const isLoading =
    leaderboardLoading || (userId ? userPositionLoading : false);
  const error = leaderboardError || userPositionError;

  if (!allData) {
    return {
      leaderboard: [],
      userPosition: null,
      isLoading,
      error,
    };
  }

  const leaderboard = allData.slice(offset, offset + limit);

  return {
    leaderboard,
    userPosition: userPosition ?? null,
    isLoading,
    error,
  };
};
