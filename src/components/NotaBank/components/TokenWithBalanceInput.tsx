import GasIcon from '@/components/icons/Gas';
import { TokenAmountInput, tokens } from './TokenAmountInput';

export default function TokenWithBalanceInput({onAmountChange, onSelect, value}:{onAmountChange: (value: string) => void, value:string, onSelect: (value: string) => void}) {
  const balance = 12340.56;
  const token = tokens[0];
  return (
    <div className="flex flex-col">
      <TokenAmountInput
        selectOptions={[...tokens]}
        amount={value}
        onAmountChange={onAmountChange}
        selectedValue={tokens[0].value}
        onSelect={onSelect}
        label="Amount"
      />
      <div className="flex flex-col gap-2 mt-2">
        <span className="text-sm font-medium">
          Balance: ${balance} {token.label}
        </span>
        <div className="w-full flex justify-between items-center mt-2">
          <span className="text-sm font-medium">Estimated Gas Fee</span>
          <div className="flex items-center gap-1 text-sm font-medium">
            <GasIcon />
            <span>$0.73 {token.label}</span>
            <span className="text-sm text-neutral-400">(0,00024 ETH)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
