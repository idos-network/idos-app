import { useIdOS } from '@/context/idos-context';
import type { idOSCredential } from '@idos-network/client';
import { useEffect, useState, useCallback } from 'react';

export function useCredentials() {
  const { idOSClient } = useIdOS();
  const [credentials, setCredentials] = useState<idOSCredential[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCredentials = useCallback(async () => {
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
  }, [idOSClient]);

  useEffect(() => {
    fetchCredentials();
  }, [fetchCredentials]);

  const refetch = useCallback(() => {
    fetchCredentials();
  }, [fetchCredentials]);

  return { credentials, isLoading, error, refetch };
}

export function useSpecificCredential(issuerAuthPublicKey: string) {
  const { credentials, isLoading, error } = useCredentials();

  const specificCredential = credentials.find((cred) => {
    if (cred.issuer_auth_public_key !== issuerAuthPublicKey) {
      return false;
    }

    if (!cred.public_notes || cred.public_notes === '') {
      return false;
    }

    try {
      const parsedNotes = JSON.parse(cred.public_notes);
      if (!parsedNotes.type || parsedNotes.type !== 'PoP') {
        return false;
      }
    } catch (e) {
      return false;
    }

    return true;
  });

  const hasCredential = !!specificCredential;

  return {
    hasCredential,
    credential: specificCredential,
    isLoading,
    error,
  };
}
