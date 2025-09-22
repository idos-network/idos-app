import { getUserById, saveUser } from '@/api/user';
import { queryClient } from '@/providers/tanstack-query/query-client';
import { useIdosStore } from '@/stores/idosStore';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

const useHasDbRecord = (id: string) => {
  return useQuery({
    queryKey: ['hasDbRecord', id],
    queryFn: () => getUserById(id).then((res) => res.length > 0),
  });
};

export default function LegacyUsersMigrator() {
  const { idOSClient } = useIdosStore();
  const hasProfile = idOSClient?.state === 'logged-in';
  const { data: hasDbRecord, isLoading: hasDbRecordLoading } = useHasDbRecord(
    idOSClient?.state === 'logged-in' ? idOSClient?.user?.id : '',
  );

  useEffect(() => {
    if (hasDbRecordLoading) return;
    if (hasProfile && !hasDbRecord) {
      saveUser({
        id: idOSClient?.user?.id,
        mainEvm: idOSClient?.walletIdentifier,
        referrerCode: '',
      });
      queryClient.invalidateQueries({
        queryKey: ['hasDbRecord', idOSClient?.user?.id],
      });
    }
  }, [hasProfile, hasDbRecord, hasDbRecordLoading]);

  return <></>;
}
