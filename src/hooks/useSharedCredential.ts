import { getSharedCredential } from '@/api/shared-credential';
import { useIdOS } from '@/context/idos-context';
import { useSharedStore } from '@/stores/shared-store';
import type { Credential } from '@idos-network/consumer';
import { useQuery } from '@tanstack/react-query';

export const useSharedCredential = () => {
  const { idOSClient } = useIdOS();
  const userId =
    idOSClient && idOSClient.state === 'logged-in' ? idOSClient.user.id : null;
  const { setSharedCredential, sharedCredential } = useSharedStore();

  return useQuery<{
    credentialId: string;
    credentialContent: Credential['credentialSubject'];
  }>({
    queryKey: ['shared-credential'],
    queryFn: () => {
      // Return stored credential immediately if available
      if (sharedCredential) {
        return Promise.resolve(sharedCredential);
      }

      return getSharedCredential(userId!).then((res) => {
        setSharedCredential(res);
        return res;
      });
    },
    enabled: !!userId,
    // Use cached data immediately if available in store
    initialData: sharedCredential as unknown as {
      credentialId: string;
      credentialContent: Credential['credentialSubject'];
    },
    staleTime: 0,
    gcTime: 0,
  });
};
