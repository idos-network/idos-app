import { useIdOS } from '@/providers/idos/idos-client';
import type { idOSCredential } from '@idos-network/client';
import { useEffect, useState } from 'react';

export function useCredentials() {
  const idOSClient = useIdOS();
  const [credentials, setCredentials] = useState<idOSCredential[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        setIsLoading(true);
        if (idOSClient.state !== 'logged-in') {
          setCredentials([]);
          return;
        }
        const creds = await idOSClient.getAllCredentials();
        setCredentials(creds);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to fetch credentials'),
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCredentials();
  }, [idOSClient]);

  return { credentials, isLoading, error };
}
