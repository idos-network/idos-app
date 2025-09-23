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
    data: leaderboardData,
    isLoading: leaderboardLoading,
    error: leaderboardError,
  } = useQuery<LeaderboardEntryData[]>({
    queryKey: ['leaderboard', 'paginated', limit, offset],
    queryFn: () => getLeaderboard({ limit, offset }),
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

  if (!leaderboardData) {
    return {
      leaderboard: [],
      userPosition: null,
      isLoading: leaderboardLoading || (userId ? userPositionLoading : false),
      error: leaderboardError || userPositionError,
    };
  }

  return {
    leaderboard: leaderboardData,
    userPosition: userPosition ?? null,
    isLoading: leaderboardLoading || (userId ? userPositionLoading : false),
    error: leaderboardError || userPositionError,
  };
};
