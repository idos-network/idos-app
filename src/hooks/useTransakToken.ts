import { getTransakToken } from '@/api/transak-token';
import { useIdOS } from '@/context/idos-context';
import { useQuery } from '@tanstack/react-query';

export const useTransakToken = (credentialId: string) => {
  const { idOSClient } = useIdOS();
  const userId = idOSClient.state === 'logged-in' ? idOSClient.user.id : null;

  return useQuery({
    queryKey: ['transak-token'],
    queryFn: () => getTransakToken('956ccc10-d804-4e72-9939-0651873fd289'),
    enabled: !!userId && !!credentialId,
    staleTime: 0,
    gcTime: 0,
  });
};
