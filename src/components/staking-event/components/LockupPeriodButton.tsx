import type { LockupPeriod } from '@/interfaces/staking-event';

interface LockupPeriodButtonProps {
  period: LockupPeriod;
  onSelect: (periodId: string) => void;
}

export function LockupPeriodButton({
  period,
  onSelect,
}: LockupPeriodButtonProps) {
  return (
    <button
      onClick={() => onSelect(period.id)}
      className={`p-4 rounded-xl border-1 transition-all ${
        period.isSelected
          ? 'border-aquamarine-400 bg-neutral-700/40'
          : 'border-neutral-800 bg-neutral-800/60 hover:border-neutral-600'
      }`}
    >
      <div className="text-left space-y-1">
        <div className="text-neutral-50 font-medium text-base">
          {period.months} months
        </div>
        <div className="text-neutral-400 text-sm">
          {period.days} Days (to test)
        </div>
        <div className="flex items-center justify-start gap-2 mt-8">
          <div className="flex items-center justify-center gap-1 size-6 bg-black rounded-full p-1">
            <img
              src="/idos.svg"
              alt="lock"
              className="size-3.5 text-green-400 items-center justify-center"
            />
          </div>
          <span className="text-aquamarine-400 text-xl font-medium">
            {period.multiplier}x
          </span>
        </div>
        <div className="text-neutral-200 text-sm">
          IDOS airdrop
          <br />
          multiplier*
        </div>
      </div>
    </button>
  );
}
