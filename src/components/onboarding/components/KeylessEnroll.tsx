import { useEffect, useRef, useState } from 'react';
import { env } from '@/env';
import Spinner from './Spinner';

interface KeylessEnrollProps {
  onError: (error: any) => void;
  onFinished: (result: any) => void;
  onCancel?: () => void;
}

export default function KeylessEnroll({
  onError,
  onFinished,
  onCancel,
}: KeylessEnrollProps) {
  const ref = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isComponentReady, setIsComponentReady] = useState(false);

  useEffect(() => {
    const importKeylessSDK = async () => {
      try {
        await import(
          '@keyless/sdk-web-components/elements/enroll/enroll-element'
        );
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to import Keyless SDK:', error);
        onError('Failed to load Keyless SDK');
      }
    };

    importKeylessSDK();
  }, [onError]);

  useEffect(() => {
    if (!isLoading && ref.current && !isComponentReady) {
      const element = ref.current;

      if (element && element.isConnected) {
        element.themeOptions = {
          colors: {
            dark: {
              primary: 'var(--color-aquamarine-500)',
              onPrimary: 'var(--color-idos-dark-mode)',
              secondary: 'var(--color-aquamarine-400)',
              onSecondary: 'var(--color-idos-dark-mode)',
              secondaryContainer: 'var(--color-idos-grey1)',
              onSecondaryContainer: 'var(--color-idos-seasalt)',
              surface: 'var(--color-idos-dark-mode)',
              onSurface: 'var(--color-idos-seasalt)',
              surfaceVariant: 'var(--color-idos-grey1)',
              onSurfaceVariant: 'var(--color-idos-seasalt)',
            },
          },
          elements: {
            ae: {
              host: {
                borderRadius: '16px',
                gap: '24px',
                padding: '24px',
              },
              headline: {
                fontSize: '20px',
                fontWeight: '600',
                marginTop: '24px',
              },
              text: {
                fontSize: '16px',
                fontWeight: '400',
              },
            },
            button: {
              host: {
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                padding: '12px 24px',
              },
            },
          },
        };
        setIsComponentReady(true);
      }
    }
  }, [isLoading, isComponentReady]);

  useEffect(() => {
    const handleError = (event: any) => {
      console.error('Keyless enrollment error:', event.message);
      onError(event.message);
    };

    const handleFinished = (event: any) => {
      console.log('Keyless enrollment finished:', event.detail);
      onFinished(event.detail);
    };

    const element = ref.current;
    if (element) {
      element.addEventListener('error', handleError);
      element.addEventListener('finished', handleFinished);

      return () => {
        element.removeEventListener('error', handleError);
        element.removeEventListener('finished', handleFinished);
      };
    }
  }, [onError, onFinished]);

  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center gap-6">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <kl-enroll
        ref={ref}
        customer={env.VITE_CUSTOMER_NAME}
        enable-camera-instructions
        public-key={env.VITE_IMAGE_ENCRYPTION_PUBLIC_KEY}
        key-id={env.VITE_IMAGE_ENCRYPTION_KEY_ID}
        lang="en"
        size="375"
        theme="dark"
        username={env.VITE_CUSTOMER_NAME + '_' + Date.now()}
        ws-url={env.VITE_KEYLESS_AUTHENTICATION_SERVICE_URL}
      />
      {onCancel && (
        <button
          onClick={onCancel}
          className="px-6 py-3 text-neutral-400 hover:text-neutral-200 transition-colors"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
