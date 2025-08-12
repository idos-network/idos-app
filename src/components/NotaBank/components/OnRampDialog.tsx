import { getNoahOnRampUrl } from '@/api/noah';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useIdOS } from '@/context/idos-context';
import { useSharedCredential } from '@/hooks/useSharedCredential';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useAccount } from 'wagmi';

const onrampProviderIcon = {
  noah: { icon: '/noah-logo.svg', name: 'Noah', color: '#FF5703' },
};

// @todo: use this from a store or context
const selectedOnrampProvider = 'noah';

const useOnrampUrl = () => {
  const { idOSClient } = useIdOS();
  const { address } = useAccount();
  const userId = idOSClient.state === 'logged-in' ? idOSClient.user.id : null;
  const { data: sharedCredential } = useSharedCredential();
  const credentialId = sharedCredential?.credentialId;

  return useQuery({
    queryKey: ['onramp-url', selectedOnrampProvider],
    queryFn: () => {
      if (!userId || !credentialId || !address) return null; // added to satisfy ts checks
      return getNoahOnRampUrl(userId, credentialId, address);
    },
    enabled: !!userId && !!credentialId && !!address,
  });
};

export default function OnRampDialog() {
  const { icon, name, color } = onrampProviderIcon[selectedOnrampProvider];
  const [isReady, setIsReady] = useState(false);
  const [isIframeLoading, setIsIframeLoading] = useState(false);
  const { data: onrampUrl, isPending, isLoading } = useOnrampUrl();

  const resetState = () => {
    setIsReady(false);
    setIsIframeLoading(false);
  };

  const handleContinueClick = () => {
    setIsReady(true);
    setIsIframeLoading(true);
  };

  const handleIframeLoad = () => {
    setIsIframeLoading(false);
  };

  return (
    <Dialog onOpenChange={resetState}>
      <DialogTrigger asChild>
        <Button
          type="button"
          className="bg-[#74FB5B] text-black h-10 rounded-xl font-sans"
        >
          Continue
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] bg-[#1A1A1A] border-none pt-10">
        {isReady ? (
          isPending || isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#74FB5B]"></div>
              <p className="text-neutral-400 text-sm">Loading checkout...</p>
            </div>
          ) : (
            <div className="relative">
              {isIframeLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center min-h-[500px] gap-4 bg-[#1A1A1A] rounded-2xl z-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#74FB5B]"></div>
                  <p className="text-neutral-400 text-sm">
                    Loading checkout...
                  </p>
                </div>
              )}
              <iframe
                src={onrampUrl ?? ''}
                className="w-full min-h-[500px] rounded-2xl overflow-hidden"
                onLoad={handleIframeLoad}
              />
            </div>
          )
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>
                <div className="flex w-full justify-center">
                  <div
                    className={`w-[56px] h-[56px] rounded-lg flex items-center justify-center bg-[${color}]`}
                  >
                    <img
                      src={icon}
                      alt="onramp-provider"
                      className="w-10 h-10"
                    />
                  </div>
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              <p className="text-xl font-normal text-neutral-50 text-center">
                {name.toUpperCase()}
              </p>
              <p className="text-sm text-neutral-400 text-center mt-2">
                This application uses {name} to securely connect accounts and
                move funds.
              </p>
              <p className="text-sm text-neutral-400 text-center">
                By clicking "Continue" you agree to {name.toUpperCase()}'s
                <a
                  href="https://noah.com/terms-of-service"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mx-1"
                >
                  <u>Terms of Service</u>
                </a>
                and
                <a
                  href="https://noah.com/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mx-1"
                >
                  <u>Privacy Policy</u>
                </a>
                .
              </p>
            </div>
          </>
        )}
        <DialogFooter>
          {!isReady && (
            <Button
              className="w-full rounded-lg bg-[#404040B2] text-neutral-50 mt-4"
              onClick={handleContinueClick}
            >
              Continue
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
