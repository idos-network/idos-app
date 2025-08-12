import { getKrakenUrl } from '@/api/kraken-url';
import Spinner from '@/components/onboarding/components/Spinner';
import { useIdOS } from '@/context/idos-context';
import { useSharedCredential } from '@/hooks/useSharedCredential';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect } from 'react';

export default function Kyc() {
  const { idOSClient, setIdOSClient } = useIdOS();
  const { data: sharedCredential, isLoading } = useSharedCredential();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: url } = useQuery({
    queryKey: ['kyc-url'],
    queryFn: () => {
      return getKrakenUrl().then((res) => res);
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: !isLoading && !sharedCredential?.credentialContent,
  });

  const onSuccess = useCallback(
    async (data: any) => {
      console.log('onSuccess', data);
      if (idOSClient.state === 'with-user-signer') {
        const loggedIn = await idOSClient.logIn();
        if (loggedIn) setIdOSClient(loggedIn);
      }

      // Invalidate shared credential query to re-check after KYC completion
      setTimeout(async () => {
        await queryClient.invalidateQueries({
          queryKey: ['shared-credential'],
        });
      }, 1000);
    },
    [idOSClient, setIdOSClient, queryClient],
  );

  const messageReceiver = useCallback(
    (message: MessageEvent) => {
      // React only messages from ID iframe
      if (message.origin === 'https://kraken.staging.sandbox.fractal.id') {
        if (message.data.open) {
          window.open(
            message.data.open,
            message.data.target,
            message.data.features,
          );
        } else {
          onSuccess(message.data);
        }
      }
    },
    [onSuccess],
  );

  useEffect(() => {
    if (sharedCredential?.credentialContent) {
      setTimeout(() => {
        navigate({ to: '/notabank/buy' });
      }, 700);
    }
  }, [sharedCredential?.credentialContent, navigate]);

  useEffect(() => {
    const controller = new AbortController();
    window.addEventListener('message', messageReceiver, {
      signal: controller.signal,
    });

    return () => controller.abort();
  }, []);

  // Show loading while checking for shared credentials
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[85vh] gap-6">
        <Spinner />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-neutral-100 mb-2">
            Checking your verification status
          </h3>
          <p className="text-neutral-400 max-w-md">
            We're checking if you already have a verified credential to skip the
            KYC process...
          </p>
        </div>
      </div>
    );
  }

  // Show success message if user already has shared credentials
  if (sharedCredential?.credentialContent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[85vh] gap-6">
        <div className="rounded-full bg-green-100 w-16 h-16 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-neutral-100 mb-2">
            Verification Complete
          </h3>
          <p className="text-gray-400 max-w-md">
            You already have a verified credential. No need to go through KYC
            verification again.
          </p>
        </div>
      </div>
    );
  }

  // Show KYC iframe if no shared credentials
  return (
    <div>
      <iframe
        src={url}
        className="w-full rounded-2xl overflow-hidden"
        style={{ height: '85vh' }}
      />
    </div>
  );
}
