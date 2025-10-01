import { getNoahOnRampUrl } from '@/api/noah';
import { BackArrow } from '@/components/icons/back-arrow';
import { useIdOS } from '@/context/idos-context';
import { useRequestGrant } from '@/hooks/useRequestGrant';
import { useSharedCredential } from '@/hooks/useSharedCredential';
import { useSharedStore } from '@/stores/shared-store';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { TransakProvider } from '../widgets/Transack';

const onrampUrlGetters = {
  noah: getNoahOnRampUrl,
  transak: () => '',
};

const CheckoutLoading = () => (
  <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#74FB5B]"></div>
    <p className="text-neutral-400 text-sm">Loading checkout...</p>
  </div>
);

const GrantRequestLoading = () => (
  <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#74FB5B]"></div>
    <p className="text-neutral-400 text-sm">Requesting access permission...</p>
    <p className="text-neutral-500 text-xs max-w-md text-center">
      We're requesting permission to access your credentials to complete the
      onramp process.
    </p>
  </div>
);

const IframeLoading = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center min-h-[500px] gap-4 bg-[#1A1A1A] rounded-2xl z-10">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#74FB5B]"></div>
    <p className="text-neutral-400 text-sm">Loading checkout...</p>
  </div>
);

// @todo: use this from a store or context

const useOnrampUrl = (selectedProvider: string) => {
  const { idOSClient } = useIdOS();
  const { address } = useAccount();
  const userId =
    idOSClient && idOSClient.state === 'logged-in' ? idOSClient.user.id : null;
  const { data: sharedCredential } = useSharedCredential();
  const credentialId = sharedCredential?.credentialId;

  return useQuery({
    queryKey: ['onramp-url', selectedProvider],
    queryFn: () => {
      if (!userId || !credentialId || !address) return null; // added to satisfy ts checks
      const onrampUrlGetter =
        onrampUrlGetters[selectedProvider as keyof typeof onrampUrlGetters];
      return onrampUrlGetter(userId, credentialId, address);
    },
    enabled: !!userId && !!credentialId && !!address,
  });
};

export default function Onramp() {
  const navigate = useNavigate();
  const { method } = useSearch({
    // @ts-ignore
    from: '/layout/notabank/onramp',
  });
  const { selectedProvider } = useSharedStore();
  const usedProvider = method || selectedProvider;
  const [isIframeLoading, setIsIframeLoading] = useState(false);
  const { data: onrampUrl, isPending, isLoading } = useOnrampUrl(usedProvider);
  const { data: sharedCredential } = useSharedCredential();
  const {
    data: accessGrant,
    mutate: requestGrant,
    isPending: isRequestingGrant,
  } = useRequestGrant();

  const handleIframeLoad = () => {
    setIsIframeLoading(false);
  };

  useEffect(() => {
    if (accessGrant) return;
    if (!sharedCredential?.credentialId) return;
    requestGrant();
  }, [accessGrant, sharedCredential, requestGrant]);

  // Show grant request loading when requesting permission
  if (isRequestingGrant) {
    return <GrantRequestLoading />;
  }

  return (
    <div className="relative">
      {/* Back Button */}
      <button
        // onClick={() => navigate({ to: '/notabank/buy' })}
        onClick={() => navigate({ to: '/' })}
        className="absolute top-4 left-4 z-10 cursor-pointer flex items-center gap-3 text-aquamarine-400 hover:text-aquamarine-700 transition-colors"
      >
        <BackArrow className="w-6 h-4" color="currentColor" />
        <span className="text-base font-normal">Back to buy</span>
      </button>
      {selectedProvider === 'transak' ? (
        <TransakProvider
          grantId={usedProvider === 'transak' ? accessGrant?.id : ''}
          key={accessGrant?.id}
        />
      ) : (
        <>
          {isPending || isLoading ? (
            <CheckoutLoading />
          ) : (
            <div className="relative">
              {isIframeLoading && <IframeLoading />}
              <iframe
                src={onrampUrl ?? ''}
                className="w-full min-h-[500px] rounded-2xl overflow-hidden"
                onLoad={handleIframeLoad}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
