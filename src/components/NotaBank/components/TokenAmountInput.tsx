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
  },
  {
    value: 'USDT',
    label: 'USDT',
    disabled: true,
  },
  {
    value: 'ETH',
    label: 'ETH',
    disabled: true,
  },
];

export function TokenAmountInput({
  value: spendAmount,
  onValueChange: setSpendAmount,
  selectedValue,
  setSelectedValue,
  label,
  selectOptions,
}: {
  value: string;
  onValueChange: (value: string) => void;
  selectedValue: string;
  setSelectedValue: (value: string) => void;
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
          value={+spendAmount ? +(+spendAmount).toFixed(2) : spendAmount}
          onChange={(e) => setSpendAmount(e.target.value)}
          className="h-16 border-0 bg-[#26262699] pr-40 pl-6 font-medium text-white text-xl placeholder:text-gray-500 focus-outline-none focus-visible:ring-0"
        />
        <Select value={selectedValue} onValueChange={setSelectedValue}>
          <SelectTrigger className="absolute top-2 right-2 min-h-[50px] w-24 border-0 bg-transparent font-medium text-white">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent className="absolute top-4 left-[100%] w-[50px] text-white bg-black/70">
            {selectOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                disabled={option.disabled}
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
