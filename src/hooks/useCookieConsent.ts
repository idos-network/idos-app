import {
  getUserCookieConsent,
  saveUserCookieConsent,
} from '@/api/user-cookie-consent';
import { useCallback, useEffect, useState } from 'react';
import { useUserId } from '@/hooks/useUserId';

export function useCookieConsent() {
  const userIdQuery: { userId: string | null; isLoading: boolean } =
    useUserId();
  const [consent, setConsent] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = userIdQuery ? userIdQuery.userId : null;
  const userLoading = userIdQuery.isLoading;

  useEffect(() => {
    const loadConsent = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // First check localStorage
        const localConsent = localStorage.getItem('cookieConsent');
        if (localConsent) {
          const parsedConsent = JSON.parse(localConsent);
          setConsent(parsedConsent);

          // If user is logged in and consent is a valid boolean, sync with backend
          if (
            userId &&
            !userLoading &&
            parsedConsent !== null &&
            parsedConsent !== undefined
          ) {
            try {
              await saveUserCookieConsent(userId, parsedConsent);
            } catch (err) {
              console.warn('Failed to sync cookie consent with backend:', err);
            }
          }
        } else if (userId && !userLoading) {
          // No local consent, try to get from backend
          try {
            const backendConsent = await getUserCookieConsent(userId);
            if (backendConsent !== null) {
              setConsent(backendConsent);
              // Store in localStorage for future use
              localStorage.setItem(
                'cookieConsent',
                JSON.stringify(backendConsent),
              );
            }
          } catch (err) {
            console.warn('Failed to load cookie consent from backend:', err);
          }
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load cookie consent',
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadConsent();
  }, [userId, userLoading]);

  const updateConsent = useCallback(
    async (accepted: boolean) => {
      try {
        // Update local state and localStorage immediately
        setConsent(accepted);
        localStorage.setItem('cookieConsent', JSON.stringify(accepted));

        // Sync with backend if user is logged in and consent is a valid boolean
        if (
          userId &&
          !userLoading &&
          accepted !== null &&
          accepted !== undefined
        ) {
          try {
            await saveUserCookieConsent(userId, accepted);
          } catch (err) {
            setError(
              'Failed to sync with server, but consent is saved locally',
            );
          }
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to update consent',
        );
      }
    },
    [userId, userLoading],
  );

  const clearConsent = useCallback(() => {
    setConsent(null);
    localStorage.removeItem('cookieConsent');
  }, []);

  return {
    consent,
    isLoading,
    error,
    updateConsent,
    clearConsent,
    hasConsent: consent !== null,
  };
}
