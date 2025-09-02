import { getTransakToken } from '@/api/transak-token';
import { useIdOS } from '@/context/idos-context';
import { useQuery } from '@tanstack/react-query';

export const useTransakToken = (credentialId: string) => {
  const { idOSClient } = useIdOS();
  const userId =
    idOSClient && idOSClient.state === 'logged-in' ? idOSClient.user.id : null;

  return useQuery({
    queryKey: ['transak-token', credentialId], // Add proper query key
    queryFn: () => getTransakToken(credentialId),
    enabled: !!userId && !!credentialId,
    staleTime: 0,
    gcTime: 0,
  });
};
