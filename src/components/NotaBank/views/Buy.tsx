import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TokenETH, TokenUSDC, TokenUSDT } from '@web3icons/react';
import { FlameIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import ActionToolbar from '../components/ActionToolbar';
import AmountInput from '../components/AmountInput';
import UserBalance from '../components/UserBalance';

interface ProviderData {
  id: string;
  name: string;
  amount: string;
  price: string;
  isBestRate?: boolean;
}

interface ProviderProps {
  data: ProviderData;
  onSelect?: (id: string) => void;
  className?: string;
  children?: ReactNode;
}

function Provider({
  data,

  onSelect,
  className = '',
  children,
}: ProviderProps) {
  const { id, amount, price, isBestRate = false } = data;

  const bgColor = isBestRate ? 'bg-green-500/20' : 'bg-neutral-800';

  return (
    <div
      className={`flex flex-col gap-2 rounded-2xl p-4 min-h-[75px] ${bgColor} ${className}`}
    >
      {isBestRate && (
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-[#74FB5B] text-black px-2 py-0.5 rounded-md text-xs font-sans">
            BEST RATE
          </span>
        </div>
      )}
      <div className="flex items-center gap-4">
        <RadioGroupItem value={id} id={id} />
        <Label
          htmlFor={id}
          className="font-sans text-md flex items-center gap-4 justify-between w-full cursor-pointer"
          onClick={() => onSelect?.(id)}
        >
          {children}
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-sans text-right">{amount}</p>
            <p className="text-sm font-sans text-neutral-400 text-right">
              {price}
            </p>
          </div>
        </Label>
      </div>
    </div>
  );
}

function BuyModule() {
  return (
    <div className="flex flex-col gap-5 p-6 bg-neutral-900 rounded-2xl flex-1 max-w-md border border-neutral-700/50">
      <h3 className="text-xl">Buy Tokens</h3>
      <form className="flex flex-col gap-5">
        <div className="flex flex-col gap-4">
          <label
            className="text-sm text-neutral-400 font-sans"
            htmlFor="spend-amount"
          >
            I want to spend
          </label>
          <div className="h-20 flex items-center gap-4 bg-neutral-800 rounded-2xl px-4">
            <AmountInput id="spend-amount" />
            <Select>
              <SelectTrigger className="h-16 w-fit border border-none text-neutral-50 tabular-nums focus:z-1 focus:-outline-offset-0 focus:outline-neutral-600 text-sm px-2">
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-none text-sm">
                <SelectItem
                  value="usd"
                  className="hover:bg-neutral-700 text-sm rounded-none"
                >
                  <span>USD</span>
                </SelectItem>
                <SelectItem
                  value="eur"
                  className="hover:bg-neutral-700 border-t border-neutral-700 text-sm rounded-none"
                >
                  <span>EUR</span>
                </SelectItem>
                <SelectItem
                  value="gbp"
                  className="hover:bg-neutral-700 border-t border-neutral-700 text-sm rounded-none"
                >
                  <span>GBP</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <label
            className="text-sm text-neutral-400 font-sans"
            htmlFor="buy-amount"
          >
            I want to buy
          </label>
          <div className="h-20 flex items-center gap-4 bg-neutral-800 rounded-2xl px-4">
            <AmountInput id="buy-amount" />
            <Select>
              <SelectTrigger className="h-16 w-fit border border-none text-neutral-50 tabular-nums focus:z-1 focus:-outline-offset-0 focus:outline-neutral-600 text-sm px-2">
                <SelectValue placeholder="Token" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-none">
                <SelectItem
                  value="usdc"
                  className="hover:bg-neutral-700 text-sm rounded-none"
                >
                  <TokenUSDC className="size-8" />
                  <span>USDC</span>
                </SelectItem>
                <SelectItem
                  value="usdt"
                  className="hover:bg-neutral-700 border-t border-neutral-700 text-sm rounded-none"
                >
                  <TokenUSDT className="size-8" />
                  <span>USDT</span>
                </SelectItem>
                <SelectItem
                  value="eth"
                  className="hover:bg-neutral-700 border-t border-neutral-700 text-sm rounded-none"
                >
                  <TokenETH className="size-8" />
                  <span>ETH</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-sans">Gas Fee</p>
          <p className="text-sm font-sans flex items-center gap-1 justify-between">
            <span>
              1 USD = 0.000005859 ETH{' '}
              <span className="text-neutral-400">($1,632)</span>
            </span>
            <span className="flex items-center gap-1">
              <FlameIcon className="size-4 text-yellow-500" />
              $15.99
            </span>
          </p>
        </div>

        <Button
          type="button"
          className="bg-[#74FB5B] text-black h-10 rounded-xl font-sans"
        >
          Continue
        </Button>
      </form>
      <p className="flex items-center gap-2 font-sans text-sm text-center place-content-center">
        Payment processing done by <img src="/noah.svg" alt="noah" width={58} />
      </p>
    </div>
  );
}

function ProviderQuotes() {
  return (
    <div className="flex flex-col gap-5 p-6 bg-neutral-900 rounded-2xl flex-1 max-w-md border border-neutral-700/50">
      <h3 className="text-xl">Provider Quotes</h3>
      <p className="text-neutral-400 font-sans text-sm">
        Compare rates from these providers.
      </p>
      <RadioGroup className="flex flex-col gap-2">
        <Provider
          data={{
            id: 'hifi',
            name: 'HiFi',
            amount: '100.00 USDC',
            price: '$101.07',
            isBestRate: true,
          }}
          onSelect={(id) => console.log('Selected provider:', id)}
          children={<img src="/hifi.svg" alt="HiFi" width={55} height={20} />}
        />
        <Provider
          data={{
            id: 'transak',
            name: 'Transak',
            amount: '100.00 USDC',
            price: '$101.07',
            isBestRate: false,
          }}
          onSelect={(id) => console.log('Selected provider:', id)}
          children={
            <img src="/transak.svg" alt="Transak" width={86} height={30} />
          }
        />
        <Provider
          data={{
            id: 'monerium',
            name: 'Monerium',
            amount: '100.00 USDC',
            price: '$101.07',
            isBestRate: false,
          }}
          onSelect={(id) => console.log('Selected provider:', id)}
          children={
            <img src="/monerium.svg" alt="Monerium" width={115} height={20} />
          }
        />
        <Provider
          data={{
            id: 'noah',
            name: 'Noah',
            amount: '100.00 USDC',
            price: '$101.07',
            isBestRate: false,
          }}
          onSelect={(id) => console.log('Selected provider:', id)}
          children={<img src="/noah.svg" alt="Noah" width={70} height={20} />}
        />
      </RadioGroup>
    </div>
  );
}

export default function Buy() {
  return (
    <div className="flex flex-col justify-center w-full md:px-[120px] max-w-7xl mx-auto">
      <div className="flex justify-between items-center w-full h-[60px] gap-5">
        <UserBalance />
        <ActionToolbar />
      </div>
      <div className="mt-10 flex justify-between gap-5 w-full max-w-4xl mx-auto">
        <BuyModule />
        <ProviderQuotes />
      </div>
    </div>
  );
}
