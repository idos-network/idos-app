import { getNoahOnRampUrl } from '@/api/noah';
import { useIdOS } from '@/context/idos-context';
import { useSharedCredential } from '@/hooks/useSharedCredential';
import { useTransakToken } from '@/hooks/useTransakToken';
import { useBuyStore } from '@/stores/buy-store';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
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
  const { selectedProvider } = useBuyStore();
  const [isIframeLoading, setIsIframeLoading] = useState(false);
  const {
    data: onrampUrl,
    isPending,
    isLoading,
  } = useOnrampUrl(selectedProvider);
  const { data: sharedCredential } = useSharedCredential();
  const credentialId = sharedCredential?.credentialId;
  const { data: transakToken, isLoading: isTransakLoading } = useTransakToken(
    selectedProvider === 'transak' ? (credentialId ?? '') : '',
  );

  const handleIframeLoad = () => {
    setIsIframeLoading(false);
  };

  if (selectedProvider === 'transak' && transakToken)
    return <TransakProvider transakToken={transakToken ?? ''} />;

  return (
    <div>
      {isPending || isLoading || isTransakLoading ? (
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
