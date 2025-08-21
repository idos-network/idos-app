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
  nearTx?: any;
  nearTxError?: Error | null;
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
  nearTx,
  nearTxError,
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

  // Handle NEAR transaction success
  useEffect(() => {
    if (nearTx && selectedAsset === 'NEAR') {
      if (nearTx.final_execution_status === 'EXECUTED') {
        const lockupMonths =
          LOCKUP_PERIODS.find((period) => period.id === selectedLockup)
            ?.months ?? 0;

        const isTestnet =
          nearTx.transaction?.signer_id?.endsWith('.testnet') ?? false;
        const explorerBaseUrl = isTestnet
          ? 'https://testnet.nearblocks.io/txns'
          : 'https://nearblocks.io/txns';

        showToast({
          type: 'success',
          message: `Successfully staked ${amount} NEAR for ${lockupMonths} months!`,
          close: true,
          duration: 10000,
          link: nearTx.transaction?.hash
            ? {
                text: 'Open in explorer',
                url: `${explorerBaseUrl}/${nearTx.transaction.hash}`,
              }
            : undefined,
        });

        onTransactionSuccess?.();
      }
    }
  }, [nearTx, selectedAsset, selectedLockup, showToast, onTransactionSuccess]);

  // Handle NEAR transaction errors
  useEffect(() => {
    if (selectedAsset === 'NEAR') {
      if (nearTxError) {
        console.error(
          'NEAR staking error:',
          nearTxError.message || nearTxError,
        );

        const isUserCancelled =
          nearTxError.message?.includes('User closed') ||
          nearTxError.message?.includes('cancelled');

        showToast({
          type: 'error',
          message: isUserCancelled
            ? 'Transaction cancelled by user.'
            : 'NEAR staking failed! Please try again.',
        });
        return;
      }

      if (nearTx && nearTx.final_execution_status !== 'EXECUTED') {
        console.error(
          'NEAR transaction failed with status:',
          nearTx.final_execution_status,
        );
        showToast({
          type: 'error',
          message: 'NEAR transaction failed! Please try again.',
        });
      }
    }
  }, [nearTx, nearTxError, selectedAsset, showToast]);
}
