import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const currencies = [
  {
    value: 'USD',
    label: 'USD',
  },
  {
    value: 'EUR',
    label: 'EUR',
    disabled: true,
    prefix: '€',
  },
  {
    value: 'GBP',
    label: 'GBP',
    disabled: true,
    prefix: '£',
  },
];

export const tokens = [
  {
    value: 'USDC',
    label: 'USDC',
    disabled: false,
  },
  {
    value: 'Tether',
    label: 'USDT',
    disabled: false,
  },
  {
    value: 'ETH',
    label: 'ETH',
    disabled: true,
  },
] as const;

// infer token info type from tokens
export type TokenInfo = (typeof tokens)[number];

export function TokenAmountInput({
  amount,
  onAmountChange,
  selectedToken,
  onSelect,
  label,
  selectOptions,
}: {
  amount: string;
  onAmountChange: (value: string) => void;
  selectedToken: TokenInfo;
  onSelect: (value: string) => void;
  label?: string;
  selectOptions: {
    value: string;
    label: string;
    disabled?: boolean;
  }[];
}) {
  return (
    <div className="space-y-2">
      <Label className="font-medium text-muted text-neutral-400">{label}</Label>
      <div className="relative rounded-2xl bg-muted-foreground">
        <Input
          type="text"
          placeholder="0"
          value={+amount ? +(+amount).toFixed(2) : amount}
          onChange={(e) => onAmountChange(e.target.value)}
          className="h-16 border-0 bg-[#26262699] pr-40 pl-6 font-medium text-white text-xl placeholder:text-gray-500 focus-outline-none focus-visible:ring-0"
        />
        <Select value={selectedToken.value} onValueChange={onSelect}>
          <SelectTrigger className="absolute top-2 right-2 min-h-[50px] w-24 h-16 border border-none text-neutral-50 tabular-nums focus:z-1 focus:-outline-offset-0 focus:outline-neutral-600 text-sm px-2">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent className="absolute top-4 left-[100%] w-[50px] text-white bg-neutral-800 border-none text-sm">
            {selectOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className="hover:bg-neutral-700 text-sm rounded-none"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
