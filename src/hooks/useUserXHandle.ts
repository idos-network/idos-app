import { getUserXHandle } from '@/api/user';
import { useQuery } from '@tanstack/react-query';
import { useUserId } from './useUserId';

export function useUserXHandle() {
  const { data: userId, isLoading: userIdLoading } = useUserId();

  const {
    data: xHandle,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['userXHandle', userId],
    queryFn: () => getUserXHandle(userId!),
    enabled: !!userId && !userIdLoading,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    xHandle: xHandle ?? '',
    isLoading: userIdLoading || isLoading,
    error,
    refetch,
  };
}
