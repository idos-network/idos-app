import { LockClockIcon, LockOpenIcon } from '@/components/icons';
import { LOCKUP_PERIODS } from '@/constants/staking-event';
import type { DepositPosition } from '@/interfaces/staking-event';
import { formatNearAmount } from 'near-api-js/lib/utils/format';
import { formatEther } from 'viem';

interface DepositCardProps {
  deposit: DepositPosition;
}

export function DepositCard({ deposit }: DepositCardProps) {
  const formatUnlockDate = (createdAt: bigint, lockDuration: bigint) => {
    const timestampMs =
      deposit.asset === 'ETH' ? Number(createdAt) * 1000 : Number(createdAt);
    const createdDate = new Date(timestampMs);
    const unlockDate = new Date(
      createdDate.getTime() + Number(lockDuration) * 24 * 60 * 60 * 1000,
    );

    const dd = String(unlockDate.getDate()).padStart(2, '0');
    const mm = String(unlockDate.getMonth() + 1).padStart(2, '0');
    const yyyy = unlockDate.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  const getLockUpPeriod = (lockDuration: bigint) => {
    const lockUpPeriod = LOCKUP_PERIODS.find(
      (item) => item.days === Number(lockDuration.toString()),
    )?.months;
    return lockUpPeriod;
  };

  return (
    <div className="bg-neutral-800/60 rounded-[20px] border border-neutral-800 p-6 font-['Inter'] w-[370px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center pb-9">
        <div className="flex items-center gap-3.5">
          <div className="h-9 rounded-full overflow-hidden flex items-center justify-left">
            <img
              src={`/${deposit.asset === 'ETH' ? 'ethereum' : 'near'}.png`}
              alt={deposit.asset}
              className="w-9 h-9"
            />
          </div>
          <div className="text-xl font-medium text-neutral-50 font-['Urbanist']">
            {deposit.asset}
          </div>
        </div>
        <div className="flex text-[13px] font-['Inter'] font-light items-center justify-left h-[25px] px-[6px] rounded-sm bg-[#00624D99] text-aquamarine-400 leading-none w-fit">
          {/* TODO: pass apy */}
          1.5% APY
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-5">
        <div className="space-y-1">
          <div className="text-sm text-neutral-400 font-light">
            Total Staked
          </div>
          <div className="text-neutral-50 text-base font-light">
            {deposit.asset === 'ETH'
              ? Number(formatEther(deposit.nativeAmount)).toFixed(2)
              : Number(
                  formatNearAmount(deposit.nativeAmount.toString()),
                ).toFixed(2)}{' '}
            {deposit.asset}
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-sm text-neutral-400 font-light">
            Exp. IDOS airdrop*
          </div>
          <div className="text-neutral-50 text-base font-light">
            {/* TODO: calculate value */}
            {deposit.asset === 'ETH'
              ? (Number(formatEther(deposit.nativeAmount)) * 110).toFixed(2)
              : (
                  Number(formatNearAmount(deposit.nativeAmount.toString())) *
                  110
                ).toFixed(2)}{' '}
            IDOS
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-1">
          <div className="text-sm text-neutral-400 font-light flex items-center gap-2">
            <LockClockIcon />
            <span>Lock-up Period</span>
          </div>
          <div className="text-neutral-50 text-base font-light">
            {getLockUpPeriod(deposit.lockDuration)} months
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-sm text-neutral-400 font-light flex items-center gap-2">
            <LockOpenIcon className="w-4 h-4" />
            <span>Unlock In</span>
          </div>
          <div className="text-neutral-50 text-base font-light">
            {formatUnlockDate(deposit.createdAt, deposit.lockDuration)}
          </div>
        </div>
      </div>
    </div>
  );
}
