import { getUserTotalPoints } from '@/api/user';
import { useQuery } from '@tanstack/react-query';
import { useUserId } from './useUserId';

export function useUserPoints() {
  const { userId, isLoading: userIdLoading } = useUserId();

  const {
    data: points,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['userPoints', userId],
    queryFn: () => getUserTotalPoints(userId!),
    enabled: !!userId && !userIdLoading,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    points: points ?? 0,
    isLoading: userIdLoading || isLoading,
    error,
    refetch,
  };
}
