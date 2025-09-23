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
  total: number | null;
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
  } = useQuery<{ data: LeaderboardEntryData[]; total?: number }>({
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
      total: null,
      userPosition: null,
      isLoading: leaderboardLoading || (userId ? userPositionLoading : false),
      error: leaderboardError || userPositionError,
    };
  }

  return {
    leaderboard: leaderboardData.data,
    total: leaderboardData.total ?? null,
    userPosition: userPosition ?? null,
    isLoading: leaderboardLoading || (userId ? userPositionLoading : false),
    error: leaderboardError || userPositionError,
  };
};
