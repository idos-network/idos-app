import AlertCircleIcon from '@/components/icons/alert-circle';
import SmallSecondaryButton from '@/components/SmallSecondaryButton';

interface AmountInputProps {
  amount: string;
  selectedAsset: string;
  isConnected: boolean;
  isAmountMaxed: boolean;
  onAmountChange: (amount: string) => void;
  onMaxClick: () => void;
}

export function AmountInput({
  amount,
  selectedAsset,
  isConnected,
  isAmountMaxed,
  onAmountChange,
  onMaxClick,
}: AmountInputProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      onAmountChange(value);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        className={`flex items-center bg-neutral-800/60 rounded-lg h-19 transition-all ${
          isAmountMaxed
            ? 'ring-1 ring-red-500 focus-within:ring-red-500'
            : 'focus-within:ring-1 focus-within:ring-aquamarine-400'
        } focus-within:border-transparent`}
      >
        <div className="flex-1 relative">
          <input
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={handleInputChange}
            onWheel={(e) => e.currentTarget.blur()}
            className="w-full h-full p-4 bg-transparent font-light text-neutral-50 text-4xl placeholder-neutral-400 focus:outline-none"
            placeholder="0.0"
            disabled={!isConnected}
          />
          {amount === '' && (
            <span className="absolute left-20 top-1/2 -translate-y-1/2 text-neutral-700 text-[28px] pointer-events-none">
              {selectedAsset}
            </span>
          )}
        </div>
        <div className="pr-4">
          <SmallSecondaryButton
            onClick={onMaxClick}
            className={`cursor-pointer leading-none px-3 text-sm h-9 hover:bg-neutral-700 ${
              !isConnected
                ? 'bg-neutral-700/70 text-neutral-500'
                : 'bg-neutral-700/70 !text-aquamarine-400'
            }`}
            disabled={!isConnected}
          >
            MAX
          </SmallSecondaryButton>
        </div>
      </div>
      <div className="flex items-center gap-2 text-[#E23636] text-xs min-h-[1rem] font-['Inter']">
        {isAmountMaxed ? (
          <AlertCircleIcon className="size-4" />
        ) : (
          <div className="w-4" />
        )}
        {isAmountMaxed ? 'Amount exceeds max balance' : '\u00A0'}
      </div>
    </div>
  );
}
