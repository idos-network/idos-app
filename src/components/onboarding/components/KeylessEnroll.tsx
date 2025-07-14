import { useEffect, useState, useCallback, useRef } from 'react';
import { env } from '@/env';
import Spinner from './Spinner';
import StepperButton from './StepperButton';

interface KeylessEnrollProps {
  userId: string;
  onError: (error: any) => void;
  onFinished: (result: any) => void;
  onCancel?: () => void;
}

export default function KeylessEnroll({
  userId,
  onError,
  onFinished,
  onCancel,
}: KeylessEnrollProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isComponentReady, setIsComponentReady] = useState(false);
  const elementRef = useRef<any>(null);
  const listenersRef = useRef<{
    handleError: (event: any) => void;
    handleFinished: (event: any) => void;
  } | null>(null);

  const enrollRef = useCallback(
    (element: any) => {
      if (elementRef.current && listenersRef.current) {
        elementRef.current.removeEventListener(
          'error',
          listenersRef.current.handleError,
        );
        elementRef.current.removeEventListener(
          'finished',
          listenersRef.current.handleFinished,
        );
      }

      if (!element) {
        elementRef.current = null;
        return;
      }

      elementRef.current = element;

      if (!isComponentReady && element.isConnected) {
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
                borderRadius: '8px',
                gap: '24px',
                padding: '24px',
              },
              headline: {
                fontSize: '20px',
                fontWeight: '500',
                marginTop: '24px',
              },
              text: {
                fontSize: '16px',
                fontWeight: '400',
              },
            },
            button: {
              host: {
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                padding: '12px 16px',
              },
            },
            cameraBiometric: {
              host: {
                border: '2px solid var(--color-aquamarine-500)',
                borderRadius: '16px',
              },
            },
          },
        };
        setIsComponentReady(true);
      }

      const handleError = (event: any) => {
        const errorMsg = event.detail || event.message || 'Unknown error';
        console.error('Keyless enrollment error:', errorMsg);
        onError(errorMsg);
      };
      const handleFinished = (event: any) => {
        const result = event.detail;
        onFinished(result);
      };

      listenersRef.current = {
        handleError,
        handleFinished,
      };

      element.addEventListener('error', handleError);
      element.addEventListener('finished', handleFinished);
    },
    [isComponentReady, onError, onFinished],
  );

  useEffect(() => {
    return () => {
      if (elementRef.current && listenersRef.current) {
        const element = elementRef.current;
        const listeners = listenersRef.current;

        element.removeEventListener('error', listeners.handleError);
        element.removeEventListener('finished', listeners.handleFinished);
      }
    };
  }, []);

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

  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center gap-6">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      {/* @ts-expect-error - Error happens when using the lottie-spinner slot */}
      <kl-enroll
        ref={enrollRef}
        customer={env.VITE_CUSTOMER_NAME}
        enable-camera-instructions
        public-key={env.VITE_IMAGE_ENCRYPTION_PUBLIC_KEY}
        key-id={env.VITE_IMAGE_ENCRYPTION_KEY_ID}
        lang="en"
        size="300"
        theme="dark"
        username={userId}
        ws-url={env.VITE_KEYLESS_AUTHENTICATION_SERVICE_URL}
      >
        <div slot="lottie-spinner">
          <Spinner />
        </div>
      </kl-enroll>
      {onCancel && (
        <div className="flex justify-center">
          <StepperButton
            onClick={onCancel}
            className="bg-none text-aquamarine-50 hover:text-aquamarine-200"
          >
            Cancel
          </StepperButton>
        </div>
      )}
    </div>
  );
}
