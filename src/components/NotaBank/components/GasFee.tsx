import GasIcon from '@/components/icons/Gas';
import { useGasFees } from '@/hooks/useGasFees';
import { useMemo } from 'react';

interface GasFeeProps {
  // Option 1: Pass transactionConfig directly (existing way)
  transactionConfig?: {
    address: `0x${string}`;
    abi: any;
    functionName: string;
    args: any[];
    account?: `0x${string}`;
  };
  // Option 2: Pass individual parameters (new way)
  contractAddress?: `0x${string}`;
  abi?: any;
  functionName?: string;
  args?: any[];
  account?: `0x${string}`;

  className?: string;
  showLabel?: boolean;
}

export function GasFee({
  transactionConfig,
  contractAddress,
  abi,
  functionName,
  args,
  account,
  className = '',
  showLabel = true,
}: GasFeeProps) {
  // Build transactionConfig from individual params if not provided directly
  const computedTransactionConfig = useMemo(() => {
    if (transactionConfig) {
      return transactionConfig;
    }

    if (!contractAddress || !abi || !functionName || !args) {
      return undefined;
    }

    return {
      address: contractAddress,
      abi,
      functionName,
      args,
      account,
    };
  }, [transactionConfig, contractAddress, abi, functionName, args, account]);

  const { gasFee, isLoading } = useGasFees({
    transactionConfig: computedTransactionConfig,
  });

  return (
    <div className={`w-full flex flex-col gap-1 ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Gas Fee</span>
        </div>
      )}
      {gasFee && !isLoading ? (
        <div className="text-sm flex items-center justify-between">
          <span>
            1 USD = {(1 / (gasFee.usd / gasFee.eth)).toFixed(9)} ETH{' '}
            <span className="text-neutral-400">
              (${(gasFee.usd / gasFee.eth).toFixed(0)})
            </span>
          </span>
          <div className="flex items-center gap-1">
            <GasIcon />
            <span className="font-medium">${gasFee.usd.toFixed(2)}</span>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="w-32 h-4 bg-neutral-700 rounded animate-pulse" />
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-neutral-700 rounded animate-pulse" />
            <div className="w-12 h-4 bg-neutral-700 rounded animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
}
