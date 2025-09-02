import { useIdOS } from '@/context/idos-context';
import { useQuery } from '@tanstack/react-query';

export const useUserId = () => {
  const { idOSClient } = useIdOS();
  return useQuery({
    queryKey: ['userId'],
    queryFn: () => {
      if (!idOSClient) return null;
      return idOSClient.state === 'logged-in' ? idOSClient.user.id : null;
    },
    enabled: !!idOSClient && idOSClient.state === 'logged-in',
    staleTime: 0,
    gcTime: 0,
  });
};
