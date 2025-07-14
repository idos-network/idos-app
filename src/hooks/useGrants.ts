import { useIdOS } from '@/providers/idos/idos-client';
import { useCredentials } from '@/hooks/useCredentials';
import { useEffect, useState } from 'react';

export interface idOSGrant {
  id: string;
  data_id: string;
  ag_grantee_wallet_identifier: string;
  locked_until: string;
}

export function useFetchGrants({ credentialId }: { credentialId: string }) {
  const { idOSClient } = useIdOS();
  const { credentials } = useCredentials();
  const [grants, setGrants] = useState<idOSGrant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchGrants = async () => {
      if (!credentialId || idOSClient.state !== 'logged-in') {
        setGrants([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const allGrants = await idOSClient.getAccessGrantsOwned();

        const matchingCredentials = credentials.filter((credential) => {
          return (
            credential.id === credentialId ||
            (credential as any).original_id === credentialId
          );
        });

        const credentialIds = matchingCredentials.map(
          (credential) => credential.id,
        );

        const credentialGrants = allGrants.filter((grant) =>
          credentialIds.includes(grant.data_id),
        );

        setGrants(credentialGrants);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to fetch grants'),
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchGrants();
  }, [credentialId, idOSClient, credentials]);

  const refetch = () => {
    setIsLoading(true);
    setError(null);
  };

  return {
    data: grants,
    isLoading,
    isError: !!error,
    error,
    isSuccess: !isLoading && !error,
    refetch,
  };
}

export function useRevokeGrant() {
  const { idOSClient } = useIdOS();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [variables, setVariables] = useState<idOSGrant | null>(null);

  const mutate = async (grant: idOSGrant) => {
    if (idOSClient.state !== 'logged-in') {
      throw new Error('User not logged in');
    }

    try {
      setIsPending(true);
      setError(null);
      setVariables(grant);

      await idOSClient.revokeAccessGrant(grant.id);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Failed to revoke grant');
      setError(error);
      throw error;
    } finally {
      setIsPending(false);
      setVariables(null);
    }
  };

  return {
    mutate,
    isPending,
    error,
    variables,
  };
}
