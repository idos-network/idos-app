import { getUserById } from '@/api/user';
import { useQuery } from '@tanstack/react-query';
import { useUserId } from './useUserId';

export function useUserMainEvm() {
  const { userId, isLoading: userIdLoading } = useUserId();

  const {
    data: userData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserById(userId!),
    enabled: !!userId && !userIdLoading,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const mainEvm = userData?.[0]?.mainEvm || '';
  console.log('mainEvm', mainEvm);
  return {
    mainEvm,
    isLoading: userIdLoading || isLoading,
    error,
    refetch,
  };
}
