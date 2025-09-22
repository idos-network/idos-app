import { getUserPoints } from '@/api/user';
import { useQuery } from '@tanstack/react-query';
import { useUserId } from './useUserId';

export function useUserPoints() {
  const { data: userId, isLoading: userIdLoading } = useUserId();

  const {
    data: points,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['userPoints', userId],
    queryFn: () => getUserPoints(userId!),
    enabled: !!userId && !userIdLoading,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    points: points ?? {
      questPoints: 0,
      socialPoints: 0,
      contributionPoints: 0,
      totalPoints: 0,
    },
    isLoading: userIdLoading || isLoading,
    error,
    refetch,
  };
}
