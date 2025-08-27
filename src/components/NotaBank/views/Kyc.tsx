import { getKrakenUrl } from '@/api/kraken-url';
import Spinner from '@/components/Spinner';
import { useIdOS } from '@/context/idos-context';
import { useSharedCredential } from '@/hooks/useSharedCredential';
import { useSharedStore } from '@/stores/shared-store';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

export default function Kyc() {
  const { idOSClient, setIdOSClient } = useIdOS();
  const { data: sharedCredential, isLoading } = useSharedCredential();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  const { selectedProvider, spendAmount, buyAmount } = useSharedStore();
  const { address } = useAccount();

  const { data: url } = useQuery({
    queryKey: ['kyc-url'],
    queryFn: () => {
      return getKrakenUrl(address as string).then((res) => res);
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: !isLoading && !sharedCredential?.credentialContent,
  });

  const handleIframeLoad = () => {
    setIsIframeLoading(false);
  };

  useEffect(() => {
    if (url) {
      setIsIframeLoading(true);
    }
  }, [url]);

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
        navigate({
          to: `/notabank/onramp?method=${selectedProvider}&toSpend=${spendAmount}&toReceive=${buyAmount}`,
        });
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
    <div className="relative">
      {isIframeLoading && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#1A1A1A] rounded-2xl z-10"
          style={{ height: '85vh' }}
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#74FB5B]"></div>
          <p className="text-neutral-400 text-sm">Loading verification...</p>
        </div>
      )}
      <iframe
        src={url}
        className="w-full rounded-2xl overflow-hidden"
        style={{ height: '85vh' }}
        onLoad={handleIframeLoad}
        sandbox="allow-popups allow-forms allow-scripts allow-same-origin"
        allow="camera; microphone; geolocation; clipboard-write"
      />
    </div>
  );
}
