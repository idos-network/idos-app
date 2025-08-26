import { useIdOS } from '@/context/idos-context';
import { type IdosWallet } from '@/interfaces/idos-profile';
import { useCallback, useEffect, useState } from 'react';

export function useFetchWallets() {
  const { idOSClient } = useIdOS();
  const [wallets, setWallets] = useState<IdosWallet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchWallets = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (idOSClient.state !== 'logged-in') {
        setWallets([]);
        return;
      }

      const userWallets = await idOSClient.getWallets();
      setWallets(userWallets as IdosWallet[]);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to fetch wallets'),
      );
    } finally {
      setIsLoading(false);
    }
  }, [idOSClient]);

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  const refetch = useCallback(() => {
    fetchWallets();
  }, [fetchWallets]);

  return { wallets, isLoading, error, refetch };
}
