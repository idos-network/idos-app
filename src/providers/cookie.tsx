import {
  getUserCookieConsent,
  saveUserCookieConsent,
} from '@/api/user-cookie-consent';
import { useUserId } from '@/hooks/useUserId';
import { useRouter } from '@tanstack/react-router';
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import * as Sentry from '@sentry/tanstackstart-react';
import ReactGA from 'react-ga';
import { env } from '@/env';

interface CookieContextValue {
  consent: number | null;
  isLoading: boolean;
  error: string | null;
  updateConsent: (accepted: number) => Promise<void>;
  clearConsent: () => void;
  hasConsent: boolean;
}

const CookieContext = createContext<CookieContextValue | null>(null);

interface CookieProviderProps {
  children: ReactNode;
}

export function CookieProvider({ children }: CookieProviderProps) {
  const userIdQuery = useUserId();
  const [consent, setConsent] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sentryInitialized = useRef(false);
  const gaInitialized = useRef(false);
  const router = useRouter();

  // @ts-expect-error started failling on ci with Property 'userId' does not exist on type
  const userId = userIdQuery.userId;
  const userLoading = userIdQuery.isLoading;

  const loadConsent = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // First check localStorage
      const localConsent = localStorage.getItem('cookieConsent');

      if (localConsent) {
        const parsedConsentString = JSON.parse(localConsent);
        let parsedConsent: number | null = null;

        // Convert boolean to number
        // true -> 1 (accepted), false -> 0 (rejected)
        // If it's already a number, keep it as is
        if (typeof parsedConsentString === 'number') {
          parsedConsent = parsedConsentString;
        } else {
          parsedConsent = parsedConsentString === true ? 2 : 0;
        }

        setConsent(parsedConsent);

        // If user is logged in and consent is a valid number, sync with backend
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

  useEffect(() => {
    loadConsent();
  }, []);

  useEffect(() => {
    if (consent === null || consent < 2) return;

    if (!sentryInitialized.current && env.VITE_SENTRY_DSN) {
      sentryInitialized.current = true;

      Sentry.init({
        dsn: env.VITE_SENTRY_DSN,
        sendDefaultPii: true,
        tracesSampleRate: 1.0,
      });
    }

    if (!gaInitialized.current && env.VITE_GA_TRACKING_ID && router) {
      gaInitialized.current = true;

      ReactGA.initialize(env.VITE_GA_TRACKING_ID);
      router.subscribe('onLoad', ({ toLocation }) => {
        ReactGA.pageview(toLocation.pathname);
      });
    }
  }, [consent, router]);

  const updateConsent = async (accepted: number) => {
    try {
      // Update local state and localStorage immediately
      setConsent(accepted);
      localStorage.setItem('cookieConsent', JSON.stringify(accepted));

      // Sync with backend if user is logged in and consent is a valid number
      if (
        userId &&
        !userLoading &&
        accepted !== null &&
        accepted !== undefined
      ) {
        try {
          await saveUserCookieConsent(userId, accepted);
        } catch (err) {
          setError('Failed to sync with server, but consent is saved locally');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update consent');
    }
  };

  const clearConsent = () => {
    setConsent(null);
    localStorage.removeItem('cookieConsent');
  };

  return (
    <CookieContext.Provider
      value={{
        consent,
        isLoading,
        error,
        updateConsent,
        clearConsent,
        hasConsent: consent !== null,
      }}
    >
      {children}
    </CookieContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieContext);

  if (!context) {
    throw new Error('useCookieConsent must be used within a CookieProvider');
  }

  return context;
}
