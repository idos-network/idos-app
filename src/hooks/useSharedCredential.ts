import { getSharedCredential } from '@/api/shared-credential';
import { useIdOS } from '@/context/idos-context';
import type { Credentials } from '@idos-network/consumer';
import { useQuery } from '@tanstack/react-query';

export const useSharedCredential = () => {
  const { idOSClient } = useIdOS();
  const userId = idOSClient.state === 'logged-in' ? idOSClient.user.id : null;

  return useQuery<{
    credentialId: string;
    credentialContent: Credentials['credentialSubject'];
  }>({
    queryKey: ['shared-credential'],
    queryFn: () => {
      return getSharedCredential(userId!).then((res) => res);
    },
    enabled: !!userId,
  });
};
