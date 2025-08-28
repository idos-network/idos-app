import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useSharedStore } from '@/stores/shared-store';
import { useQueries } from '@tanstack/react-query';
import type { QuoteRateResponse } from 'functions/provider-quotes';
import type { ReactNode } from 'react';
import { useEffect, useMemo } from 'react';

const providers = ['hifi', 'transak', 'noah'];

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
  bestRate?: boolean;
}

const useFetchProviderQuotes = ({
  sourceCurrency,
  destinationCurrency,
}: {
  sourceCurrency: string;
  destinationCurrency: string;
}) => {
  return useQueries({
    queries: providers.map((provider) => ({
      queryKey: [
        'provider-quote',
        { provider, sourceCurrency, destinationCurrency },
      ],
      queryFn: () =>
        fetch(
          `/api/provider-quotes?provider=${provider}&sourceCurrency=${sourceCurrency}&destinationCurrency=${destinationCurrency}`,
        ).then((res) => res.json()) as Promise<QuoteRateResponse>,
    })),
    combine: (results) => ({
      data: results.map((result) => result.data),
      isPending: results.some((result) => result.isPending),
    }),
  });
};

export function Provider({
  data,
  onSelect,
  className = '',
  children,
  bestRate = false,
}: ProviderProps) {
  const { id, amount, price } = data;
  const bgColor = bestRate ? 'bg-[#043102]' : 'bg-neutral-800/40';

  return (
    <div
      className={`flex flex-col gap-5 rounded-md p-5 cursor-pointer ${bgColor} ${className}`}
      onClick={() => onSelect?.(id)}
    >
      {bestRate && (
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
          className="text-md flex items-center gap-4 justify-between w-full"
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

export const providerLogos = {
  hifi: <img src="/hifi.svg" alt="HiFi" width={55} height={20} />,
  transak: <img src="/transak.svg" alt="Transak" width={86} height={30} />,
  noah: <img src="/noah.svg" alt="Noah" width={70} height={20} />,
};

// Skeleton component for loading state
function ProviderSkeleton() {
  return (
    <div className="flex flex-col gap-2 rounded-md p-4 min-h-20 bg-neutral-800/40 animate-pulse">
      <div className="flex items-center gap-4">
        {/* Radio button skeleton */}
        <div className="size-5 rounded-full bg-neutral-700"></div>
        <div className="flex items-center gap-4 justify-between w-full">
          {/* Logo skeleton */}
          <div className="h-5 w-16 bg-neutral-700 rounded"></div>
          <div className="flex flex-col gap-0.5">
            {/* Amount skeleton */}
            <div className="h-4 w-20 bg-neutral-700 rounded"></div>
            {/* Price skeleton */}
            <div className="h-4 w-16 bg-neutral-700 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProviderQuotes() {
  const {
    selectedCurrency,
    selectedToken,
    spendAmount,
    selectedProvider,
    setSelectedProvider,
    setRate,
  } = useSharedStore();
  const quotes = useFetchProviderQuotes({
    sourceCurrency: selectedCurrency,
    destinationCurrency: selectedToken,
  });
  // Sort quotes by rate (best rate first - highest rate gives most tokens for same spend amount)
  const sortedQuotes = useMemo(() => {
    if (quotes.data?.length === 0) return [];

    return [...quotes.data]
      .filter((quoteData) => quoteData && quoteData.rate)
      .sort((a, b) => {
        const rateA = parseFloat(a?.rate ?? '0');
        const rateB = parseFloat(b?.rate ?? '0');
        return rateB - rateA;
      });
  }, [quotes.data]);

  const selectedProviderQuote = useMemo(() => {
    return quotes.data?.find((quote) => quote?.name === selectedProvider);
  }, [quotes.data, selectedProvider]);

  useEffect(() => {
    if (selectedProviderQuote) setRate(selectedProviderQuote.rate);
  }, [selectedProviderQuote]);

  useEffect(() => {
    // Always select the best provider (remove the early return)
    setSelectedProvider(sortedQuotes[0]?.name ?? '');
  }, [sortedQuotes[0]?.name, setSelectedProvider]);

  // Find the best rate (highest rate means best conversion)
  return (
    <div className="flex flex-col gap-5 flex-1 max-w-md bg-[#26262699] p-6 rounded-3xl">
      <h3 className="text-lg font-heading">Provider Quotes</h3>
      <p className="text-muted-foreground text-sm">
        Compare rates from these providers.
      </p>

      {quotes.isPending ? (
        <div className="flex flex-col gap-2">
          {/* Show 3 skeleton loaders to represent the typical number of providers */}
          <ProviderSkeleton />
          <ProviderSkeleton />
          <ProviderSkeleton />
        </div>
      ) : (
        <RadioGroup className="flex flex-col gap-2" value={selectedProvider}>
          {sortedQuotes.map((quoteData, index) => {
            if (!quoteData) return null;

            return (
              <Provider
                key={quoteData?.name}
                bestRate={!index}
                data={{
                  id: quoteData?.name ?? '',
                  name: quoteData?.name ?? '',
                  amount: `${+spendAmount || 100} ${selectedToken}`,
                  price: `${(+quoteData?.rate * (+spendAmount || 100)).toFixed(2)} ${selectedCurrency}`,
                  isBestRate: false,
                }}
                onSelect={(id) => {
                  setSelectedProvider?.(id);
                }}
                children={
                  providerLogos[quoteData?.name as keyof typeof providerLogos]
                }
              />
            );
          })}
        </RadioGroup>
      )}
    </div>
  );
}
