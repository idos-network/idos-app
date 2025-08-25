import { getNoahOnRampUrl } from '@/api/noah';
import { useIdOS } from '@/context/idos-context';
import { useRequestGrant } from '@/hooks/useRequestGrant';
import { useSharedCredential } from '@/hooks/useSharedCredential';
import { useTransakToken } from '@/hooks/useTransakToken';
import { useSharedStore } from '@/stores/shared-store';
import { useQuery } from '@tanstack/react-query';
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

const TransakTokenLoading = () => (
  <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#74FB5B]"></div>
    <p className="text-neutral-400 text-sm">Loading Transak token...</p>
    <p className="text-neutral-500 text-xs max-w-md text-center">
      Setting up secure payment processing with Transak.
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
  const userId = idOSClient.state === 'logged-in' ? idOSClient.user.id : null;
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
  const { selectedProvider } = useSharedStore();
  const [isIframeLoading, setIsIframeLoading] = useState(false);
  const {
    data: onrampUrl,
    isPending,
    isLoading,
  } = useOnrampUrl(selectedProvider);
  const { data: sharedCredential } = useSharedCredential();
  const {
    data: accessGrant,
    mutate: requestGrant,
    isPending: isRequestingGrant,
  } = useRequestGrant();
  const { data: transakToken, isLoading: isTransakLoading } = useTransakToken(
    selectedProvider === 'transak' ? (accessGrant?.id ?? '') : '',
  );

  const handleIframeLoad = () => {
    setIsIframeLoading(false);
  };

  useEffect(() => {
    if (accessGrant) return;
    if (!sharedCredential?.credentialId) return;
    requestGrant();
  }, [accessGrant, sharedCredential, requestGrant]);

  if (selectedProvider === 'transak' && transakToken)
    return <TransakProvider transakToken={transakToken ?? ''} />;

  // Show grant request loading when requesting permission
  if (isRequestingGrant) {
    return <GrantRequestLoading />;
  }

  // Show specific Transak loading when loading Transak token
  if (isTransakLoading) {
    return <TransakTokenLoading />;
  }

  return (
    <div>
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
    </div>
  );
}
