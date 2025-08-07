import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import type { ReactNode } from 'react';

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

export function Provider({
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

export function ProviderQuotes() {
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
