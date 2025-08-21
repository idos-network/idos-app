import { LOCKUP_PERIODS } from '@/constants/staking-event';
import { useToast } from '@/hooks/useToast';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';

interface UseStakeTxHandlerProps {
  isConfirmed: boolean;
  isWriteError: boolean;
  isConfirmError: boolean;
  writeError: Error | null;
  hash: string | undefined;
  selectedAsset: string;
  selectedLockup: string;
  amount: string;
  onTransactionSuccess?: () => void;
}

export function useStakeTxHandler({
  isConfirmed,
  isWriteError,
  isConfirmError,
  writeError,
  hash,
  selectedAsset,
  selectedLockup,
  amount,
  onTransactionSuccess,
}: UseStakeTxHandlerProps) {
  const { showToast } = useToast();
  const { chain } = useAccount();

  // Handle ETH transaction confirmation
  useEffect(() => {
    if (isConfirmed && selectedAsset === 'ETH') {
      const lockupMonths =
        LOCKUP_PERIODS.find((period) => period.id === selectedLockup)?.months ??
        0;

      showToast({
        type: 'success',
        message: `Staked ${amount} ETH for ${lockupMonths} months!`,
        close: true,
        duration: 10000,
        link: {
          text: 'Open in explorer',
          url: `${chain?.blockExplorers?.default.url}/tx/${hash}`,
        },
      });

      onTransactionSuccess?.();
    }
  }, [
    isConfirmed,
    selectedAsset,
    selectedLockup,
    showToast,
    hash,
    chain,
    onTransactionSuccess,
  ]);

  // Handle ETH transaction errors
  useEffect(() => {
    if (isWriteError && writeError && selectedAsset === 'ETH') {
      console.error('ETH staking failed:', writeError);
      showToast({
        type: 'error',
        message: 'ETH staking failed! Please try again.',
      });
    }
  }, [isWriteError, writeError, selectedAsset, showToast]);

  // Handle ETH transaction confirmation errors
  useEffect(() => {
    if (isConfirmError && selectedAsset === 'ETH') {
      showToast({
        type: 'error',
        message: 'Transaction confirmation failed. Please check your wallet.',
      });
    }
  }, [isConfirmError, selectedAsset, showToast]);
}
