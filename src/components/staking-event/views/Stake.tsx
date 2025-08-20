import { BackArrow } from '@/components/icons/back-arrow';
import WalletIcon from '@/components/icons/wallet';
import SmallPrimaryButton from '@/components/SmallPrimaryButton';
import SmallSecondaryButton from '@/components/SmallSecondaryButton';
import {
  AmountInput,
  AssetSelector,
  LockupPeriodButton,
} from '@/components/staking-event/components';

import { LOCKUP_PERIODS, STAKING_ASSETS } from '@/constants/staking-event';
import { handleStake } from '@/handlers/staking-event';
import { useToast } from '@/hooks/useToast';
import { useWalletConnector } from '@/hooks/useWalletConnector';
import type { LockupPeriod, StakingAsset } from '@/interfaces/staking-event';
import { useNavigate } from '@tanstack/react-router';
import { formatNearAmount } from 'near-api-js/lib/utils/format';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatEther } from 'viem';
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';

interface LockupPeriodWithSelection extends LockupPeriod {
  isSelected: boolean;
}

export function Stake() {
  const { address, chain } = useAccount();
  const {
    writeContractAsync,
    data: hash,
    isPending: isWritePending,
    isError: isWriteError,
    error: writeError,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError: isConfirmError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const walletConnector = useWalletConnector();
  const wallet = walletConnector.isConnected && walletConnector.connectedWallet;
  const { showToast } = useToast();
  const navigate = useNavigate();

  const getDefaultAsset = useCallback(() => {
    if (walletConnector.evmWallet.isConnected) {
      return 'ETH';
    }
    if (walletConnector.nearWallet.selector?.isSignedIn()) {
      return 'NEAR';
    }
    return 'ETH';
  }, [
    walletConnector.evmWallet.isConnected,
    walletConnector.nearWallet.selector,
  ]);

  const [selectedAsset, setSelectedAsset] = useState(() => getDefaultAsset());
  const [amount, setAmount] = useState('');
  const [selectedLockup, setSelectedLockup] = useState('6-months');
  const [hasUserManuallySelected, setHasUserManuallySelected] = useState(false);
  const [isNearTransactionPending, setIsNearTransactionPending] =
    useState(false);

  const availableAssets = useMemo(() => {
    return STAKING_ASSETS.map((asset: StakingAsset, index: number) => ({
      ...asset,
      connected:
        index === 0
          ? walletConnector.evmWallet.isConnected
          : (walletConnector.nearWallet.selector?.isSignedIn() ?? false),
    }));
  }, [
    walletConnector.evmWallet.isConnected,
    walletConnector.nearWallet.selector,
  ]);

  const currentAsset = useMemo(() => {
    const asset = availableAssets.find((a) => a.name === selectedAsset);
    return asset || availableAssets[0];
  }, [availableAssets, selectedAsset]);

  const isCurrentAssetConnected = currentAsset.connected;

  // Auto-select connected asset
  useEffect(() => {
    if (hasUserManuallySelected) return;

    const defaultAsset = getDefaultAsset();

    if (!isCurrentAssetConnected && defaultAsset !== selectedAsset) {
      const defaultAssetConnected = availableAssets.find(
        (asset) => asset.name === defaultAsset,
      )?.connected;
      if (defaultAssetConnected) {
        setSelectedAsset(defaultAsset);
      }
    }
  }, [
    getDefaultAsset,
    isCurrentAssetConnected,
    selectedAsset,
    availableAssets,
    hasUserManuallySelected,
  ]);

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

      setAmount('');
    }
  }, [isConfirmed, selectedAsset, selectedLockup, showToast, hash]);

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

  // Reset NEAR transaction state when switching away from NEAR
  useEffect(() => {
    if (selectedAsset !== 'NEAR' && isNearTransactionPending) {
      setIsNearTransactionPending(false);
    }
  }, [selectedAsset, isNearTransactionPending]);

  const handleAssetChange = (newAsset: string) => {
    setSelectedAsset(newAsset);
    setHasUserManuallySelected(true);
  };

  const handleWalletConnection = async () => {
    try {
      if (selectedAsset === 'ETH') {
        await walletConnector.connectEthereum();
      } else if (selectedAsset === 'NEAR') {
        await walletConnector.connectNear();
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const getMaxBalance = useCallback(() => {
    if (!isCurrentAssetConnected) return '0';

    if (selectedAsset === 'ETH' && wallet && wallet.type === 'evm') {
      return formatEther(wallet.balance);
    } else if (selectedAsset === 'NEAR' && wallet && wallet.type === 'near') {
      return formatNearAmount(wallet.balance?.toString() ?? '0');
    }
    return '0';
  }, [selectedAsset, isCurrentAssetConnected, wallet]);

  const isAmountMaxed = useMemo(() => {
    if (!amount || amount === '' || !isCurrentAssetConnected) return false;

    const maxBalance = getMaxBalance();
    const numericAmount = parseFloat(amount);
    const numericMax = parseFloat(maxBalance);

    return numericAmount > numericMax;
  }, [amount, getMaxBalance, isCurrentAssetConnected]);

  const lockupPeriods: LockupPeriodWithSelection[] = useMemo(() => {
    return LOCKUP_PERIODS.map((period) => ({
      ...period,
      isSelected: selectedLockup === period.id,
    }));
  }, [selectedLockup]);

  // Compute overall transaction state
  const isTransactionPending = useMemo(() => {
    if (selectedAsset === 'ETH') {
      return isWritePending || isConfirming;
    } else if (selectedAsset === 'NEAR') {
      return isNearTransactionPending;
    }
    return false;
  }, [selectedAsset, isWritePending, isConfirming, isNearTransactionPending]);

  const isStakeButtonDisabled = useMemo(() => {
    if (!isCurrentAssetConnected) {
      return false;
    }

    return isAmountMaxed || isTransactionPending || !amount;
  }, [isCurrentAssetConnected, isAmountMaxed, isTransactionPending, amount]);

  const handleLockupSelect = (lockupId: string) => {
    setSelectedLockup(lockupId);
  };

  const stakeAsset = useCallback(async () => {
    if (!isCurrentAssetConnected) {
      await handleWalletConnection();
      return;
    }

    if (!amount || isAmountMaxed) {
      return;
    }

    const lockupDays =
      LOCKUP_PERIODS.find((period) => period.id === selectedLockup)?.days ?? 0;

    const lockupMonths =
      LOCKUP_PERIODS.find((period) => period.id === selectedLockup)?.months ??
      0;

    try {
      if (selectedAsset === 'NEAR') {
        setIsNearTransactionPending(true);
      }

      await handleStake({
        selectedAsset,
        amount,
        lockupDays,
        address,
        writeContractAsync,
        walletConnector,
      });

      // TODO: handle NEAR success
      if (selectedAsset === 'NEAR') {
        showToast({
          type: 'success',
          message: `Successfully staked ${amount} ${selectedAsset} for ${lockupMonths} months!`,
        });
        setAmount('');
        setIsNearTransactionPending(false);
      }
    } catch (error) {
      console.error('Staking failed:', error);

      if (selectedAsset === 'NEAR') {
        setIsNearTransactionPending(false);
        showToast({
          type: 'error',
          message: 'NEAR staking failed! Please try again.',
        });
      }
    }
  }, [
    isCurrentAssetConnected,
    amount,
    isAmountMaxed,
    selectedLockup,
    selectedAsset,
    address,
    writeContractAsync,
    walletConnector,
    handleWalletConnection,
    showToast,
  ]);

  return (
    <div>
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate({ to: '/staking-event' })}
          className="cursor-pointer flex items-center gap-3 text-aquamarine-400 hover:text-aquamarine-700 transition-colors"
        >
          <BackArrow className="w-6 h-4" color="currentColor" />
          <span className="text-base font-normal">Back to dashboard</span>
        </button>
      </div>

      {/* Main Stake Interface */}
      <div className="flex items-center justify-center w-[600px] mx-auto">
        <div className="relative p-6 w-full bg-neutral-800/30 rounded-2xl border border-neutral-800 overflow-hidden">
          {/* Header */}
          <h1 className="text-[28px] font-normal text-white mb-10">Stake</h1>
          <div className="space-y-8">
            {/* Asset Selection */}
            <div className="space-y-3">
              <div className="text-neutral-50 text-base font-normal">
                Choose an asset to stake
              </div>
              <AssetSelector
                assets={availableAssets}
                selectedAsset={selectedAsset}
                onAssetChange={handleAssetChange}
              />
            </div>

            {/* Amount Input */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-neutral-50 text-base font-normal">
                  Amount
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-400 font-['Inter']">
                  <WalletIcon
                    className="size-4 text-neutral-400"
                    color="currentColor"
                  />
                  <div className="text-sm font-normal">
                    Balance:{' '}
                    <span className="font-light">
                      {isCurrentAssetConnected
                        ? selectedAsset === 'ETH' && wallet
                          ? Number(formatEther(wallet.balance)).toFixed(4)
                          : selectedAsset === 'NEAR' && wallet
                            ? formatNearAmount(
                                wallet.balance?.toString() ?? '0',
                                3,
                              )
                            : '0.00'
                        : '- '}
                      {selectedAsset}
                    </span>
                  </div>
                  {!isCurrentAssetConnected && (
                    <div className="text-sm">(not connected)</div>
                  )}
                </div>
              </div>
              <AmountInput
                amount={amount}
                selectedAsset={selectedAsset}
                isConnected={isCurrentAssetConnected}
                isAmountMaxed={isAmountMaxed}
                onAmountChange={setAmount}
                onMaxClick={() => setAmount(getMaxBalance())}
              />
            </div>

            {/* Lock-up Period */}
            <div className="space-y-3 -mt-6 border-b border-neutral-800 pb-8">
              <div className="text-neutral-50 text-base font-normal">
                Lock-up period
              </div>
              <div className="grid grid-cols-3 gap-3">
                {lockupPeriods.map((period) => (
                  <LockupPeriodButton
                    key={period.id}
                    period={period}
                    onSelect={handleLockupSelect}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-10 mt-5">
            <div className="flex flex-col rounded-xl border border-neutral-800 p-4 gap-3">
              <div className="flex items-center justify-between text-neutral-50 text-base font-medium">
                <div>Expected IDOS airdrop*</div>
                <span>0.00 IDOS</span> {/* TODO: update to calculate value */}
              </div>
              <p className="text-neutral-400 text-sm font-light font-['Inter']">
                Based on current token prices, total amount staked, and lock-up
                periods.
                <br />
                Final calculation date: Oct. 31, 2025. Amount of IDOS tokens may
                vary.
              </p>
            </div>
            <div className="flex gap-3">
              <SmallSecondaryButton
                className="flex-1 h-10 bg-neutral-700/50 hover:bg-neutral-700"
                onClick={() => {}}
              >
                Cancel
              </SmallSecondaryButton>
              <SmallPrimaryButton
                className={`flex-1 h-10 bg-aquamarine-400 text-neutral-950 hover:bg-aquamarine-600 ${
                  isStakeButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={stakeAsset}
                disabled={isStakeButtonDisabled}
              >
                {isTransactionPending ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-neutral-950 border-t-transparent"></div>
                    <span>
                      {selectedAsset === 'ETH' &&
                        isWritePending &&
                        'Confirm in Wallet...'}
                      {selectedAsset === 'ETH' &&
                        isConfirming &&
                        'Confirming...'}
                      {selectedAsset === 'NEAR' && 'Processing...'}
                    </span>
                  </div>
                ) : isCurrentAssetConnected ? (
                  `Stake ${selectedAsset}`
                ) : (
                  `Connect ${selectedAsset} Wallet`
                )}
              </SmallPrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
