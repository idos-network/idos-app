import { getTransakToken } from '@/api/transak-token';
import { useIdOS } from '@/context/idos-context';
import { useQuery } from '@tanstack/react-query';

export const useTransakToken = (credentialId: string) => {
  const { idOSClient } = useIdOS();
  const userId = idOSClient.state === 'logged-in' ? idOSClient.user.id : null;

  return useQuery({
    queryKey: ['transak-token'],
    queryFn: () => getTransakToken(credentialId),
    enabled: !!userId && !!credentialId,
  });
};
