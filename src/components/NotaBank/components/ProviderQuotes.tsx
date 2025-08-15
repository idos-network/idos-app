import axiosInstance from '@/api/axios';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useBuyStore } from '@/stores/buy-store';
import { useQueries } from '@tanstack/react-query';

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

  const bgColor = isBestRate ? 'bg-secondary/10' : 'bg-neutral-800/40';

  return (
    <div
      className={`flex flex-col gap-2 rounded-md p-4 min-h-16 ${bgColor} ${className}`}
    >
      {isBestRate && (
        <div className="flex items-center gap-2">
          <span className="bg-secondary text-black px-2 py-0.5 rounded-sm text-xs">
            BEST RATE
          </span>
        </div>
      )}
      <div className="flex items-center gap-4">
        <RadioGroupItem value={id} id={id} className="size-5 text-secondary" />
        <Label
          htmlFor={id}
          className="text-md flex items-center gap-4 justify-between w-full cursor-pointer"
          onClick={() => onSelect?.(id)}
        >
          {children}
          <div className="flex flex-col gap-0.5">
            <p className="text-sm text-right">{amount}</p>
            <p className="text-sm text-neutral-400 text-right">{price}</p>
          </div>
        </Label>
      </div>
    </div>
  );
}

const providers = ['hifi', 'transak', 'noah'];

const useFetchProviderQuotes = () => {
  return useQueries({
    queries: providers.map((provider) => ({
      queryKey: ['provider-quote', provider],
      queryFn: () => axiosInstance.get(`/provider-quotes?provider=${provider}`),
    })),
  });
};

export function ProviderQuotes() {
  useFetchProviderQuotes();
  const { setSelectedCurrency, setSelectedToken, setSelectedProvider } =
    useBuyStore();

  return (
    <div className="flex flex-col gap-5 flex-1 max-w-md">
      <h3 className="text-lg font-heading">Provider Quotes</h3>
      <p className="text-muted-foreground text-sm">
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
          onSelect={(id) => {
            console.log('Selected provider:', id);
            setSelectedCurrency('USDC');
            setSelectedToken('USDC');
            setSelectedProvider('hifi');
          }}
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
          onSelect={(id) => {
            console.log('Selected provider:', id);
            setSelectedCurrency('USDC');
            setSelectedToken('USDC');
            setSelectedProvider('transak');
          }}
          children={
            <img src="/transak.svg" alt="Transak" width={86} height={30} />
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
          onSelect={(id) => {
            console.log('Selected provider:', id);
            setSelectedCurrency('USDC');
            setSelectedToken('USDC');
            setSelectedProvider('noah');
          }}
          children={<img src="/noah.svg" alt="Noah" width={70} height={20} />}
        />
      </RadioGroup>
    </div>
  );
}
