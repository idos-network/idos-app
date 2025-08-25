import { rewardLockTokenVaultAbi } from '@/abis/RewardLockTokenVault';
import { parseWithSchema } from '@/api/parser';
import InfoIcon from '@/components/icons/info';
import { config } from '@/config/wagmi.config';
import { env } from '@/env';
import { useFetchWallets } from '@/hooks/useFetchWallets';
import {
  ethDepositPositionSchema,
  nearDepositPositionSchema,
  type DepositPosition,
  type NearDepositPosition,
} from '@/interfaces/staking-event';
import { JsonRpcProvider } from '@near-js/providers';
import { useEffect, useMemo, useState } from 'react';
import { readContract } from 'wagmi/actions';
import { DepositCard } from '../components';
import { IDOSAirdropCard } from '../components/IDOSAirdropCard';

// TODO: to be updated once NEAR contracts are ready
export function MyStakings() {
  const [ethDeposits, setEthDeposits] = useState<DepositPosition[]>([]);
  const [nearDeposits, setNearDeposits] = useState<DepositPosition[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { wallets } = useFetchWallets();
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [tooltipText, setTooltipText] = useState<string>('');

  // Combine all deposits
  const allDeposits = [...ethDeposits, ...nearDeposits];

  const evmWallets = useMemo(
    () => wallets.filter((wallet) => wallet.wallet_type === 'EVM'),
    [wallets],
  );

  // Fetch deposits for all EVM wallets
  useEffect(() => {
    if (evmWallets.length === 0) {
      return;
    }

    const fetchDeposits = async () => {
      setIsLoading(true);
      try {
        const allDepositIds: bigint[] = [];

        for (const wallet of evmWallets) {
          const depositIds = await readContract(config, {
            address: env.VITE_ETH_STAKING_CONTRACT_ADDRESS as `0x${string}`,
            abi: rewardLockTokenVaultAbi,
            functionName: 'getUserDepositIds',
            args: [wallet.address as `0x${string}`],
          });
          allDepositIds.push(...(depositIds as bigint[]));
        }

        const depositPromises = allDepositIds.map(async (depositId) => {
          try {
            const depositData = await readContract(config, {
              address: env.VITE_ETH_STAKING_CONTRACT_ADDRESS as `0x${string}`,
              abi: rewardLockTokenVaultAbi,
              functionName: 'getDeposit',
              args: [depositId],
            });

            const deposit = parseWithSchema(
              depositData,
              ethDepositPositionSchema,
            );

            return {
              asset: 'ETH',
              id: depositId,
              nativeAmount: deposit.ethAmount,
              ...deposit,
            };
          } catch (error) {
            console.error(`Failed to fetch deposit ${depositId}:`, error);
            return null;
          }
        });

        const results = await Promise.all(depositPromises);
        const validDeposits = results.filter((deposit) => deposit !== null);
        setEthDeposits(validDeposits as DepositPosition[]);
      } catch (error) {
        console.error('Failed to fetch deposits:', error);
        setEthDeposits([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeposits();
  }, [evmWallets]);

  const nearWallets = useMemo(
    () => wallets.filter((wallet) => wallet.wallet_type === 'NEAR'),
    [wallets],
  );

  // Fetch deposits for all NEAR wallets
  useEffect(() => {
    if (nearWallets.length === 0) {
      return;
    }

    const fetchNearDeposits = async () => {
      try {
        const provider = new JsonRpcProvider({
          url: 'https://test.rpc.fastnear.com',
        });

        const allNearDeposits: NearDepositPosition[] = [];

        for (const wallet of nearWallets) {
          const nearDeposits = await provider.callFunction(
            env.VITE_NEAR_STAKING_CONTRACT_ADDRESS,
            'get_user_deposit',
            { account_id: wallet.address, stnear_price: '1' },
          );

          if (Array.isArray(nearDeposits)) {
            allNearDeposits.push(...nearDeposits);
          } else if (nearDeposits) {
            allNearDeposits.push(nearDeposits as NearDepositPosition);
          }
        }

        const deposits = allNearDeposits.map((deposit) => {
          try {
            const parsedDeposit = parseWithSchema(
              deposit,
              nearDepositPositionSchema,
            );

            const finalDeposit: DepositPosition = {
              asset: 'NEAR',
              id: BigInt(deposit.created_timestamp_ms),
              originalAmount: BigInt(parsedDeposit.shares_deposited),
              projectRewardsWithdrawn: BigInt(parsedDeposit.shares_withdrawn),
              nativeAmount: BigInt(parsedDeposit.near_deposited),
              lstExchangeRateAtCreation: BigInt(
                parsedDeposit.current_stnear_value,
              ),
              lstExchangeRateAtUnlock: BigInt(
                parsedDeposit.current_stnear_value,
              ),
              createdAt: BigInt(parsedDeposit.created_timestamp_ms),
              lockDuration: BigInt(parsedDeposit.days),
              isUnlocked: parsedDeposit.withdrawn_timestamp_ms === null,
            };

            return finalDeposit;
          } catch (error) {
            console.error(
              `Failed to fetch deposit ${deposit.created_timestamp_ms}:`,
              error,
            );
            return null;
          }
        });
        const results = await Promise.all(deposits);
        const validDeposits = results.filter((deposit) => deposit !== null);
        setNearDeposits(validDeposits);
      } catch (error) {
        console.error('Failed to fetch near deposits:', error);
        setNearDeposits([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNearDeposits();
  }, [nearWallets]);

  return (
    <div className="space-y-10">
      <IDOSAirdropCard />

      {/* Header */}
      <div className="flex flex-col gap-6 items-start">
        <div className="flex justify-start items-center gap-2">
          <div className="text-xl items-center font-medium text-neutral-50">
            Staked assets
          </div>
          <div className="relative">
            <button
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setTooltipPosition({
                  x: rect.left + rect.width / 2,
                  y: rect.bottom + 8,
                });
                setTooltipText(
                  'Assets are staked in a non-custodial manner. \nidOS does not hold or have access to user funds and is not responsible for any potential losses or issues related to staking. Users retain full control and will be able to un-stake their assets from this interface once the lock-up period ends.',
                );
                setShowTooltip(true);
              }}
              onMouseLeave={() => {
                setShowTooltip(false);
                setTooltipPosition(null);
                setTooltipText('');
              }}
              className="flex items-center text-neutral-400 hover:text-neutral-300 transition-colors"
            >
              <InfoIcon className="w-4 h-4 text-neutral-500" />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-neutral-400">
              Loading your staked assets...
            </div>
          </div>
        )}

        {/* No Deposits */}
        {!isLoading && allDeposits.length === 0 && (
          <div className="flex justify-center items-center py-12">
            <div className="text-neutral-400">No staked assets found</div>
          </div>
        )}

        {/* Cards */}
        {!isLoading && allDeposits.length > 0 && (
          <div className="flex flex-wrap gap-5">
            {allDeposits.map((deposit) => (
              <DepositCard key={deposit.id} deposit={deposit} />
            ))}
          </div>
        )}
      </div>

      {/* TODO: move to shared tooltip component */}
      {showTooltip && tooltipPosition && (
        <div
          className="fixed z-50 bg-neutral-800 rounded-lg p-4 whitespace-pre-line text-neutral-300 drop-shadow-[0_0_10px_rgba(0,0,0,0.7)] w-[340px] pointer-events-none"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translateX(5%)',
          }}
        >
          <div className="text-sm text-neutral-400">{tooltipText}</div>
        </div>
      )}
    </div>
  );
}
