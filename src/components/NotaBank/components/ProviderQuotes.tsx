import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { RadioGroupProps } from '@radix-ui/react-radio-group';
import type { QuoteRateResponse } from 'functions/provider-quotes';
import type { ReactNode } from 'react';
import { useMemo } from 'react';

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

interface ProviderQuoteData {
  quote: QuoteRateResponse;
  spendAmount: number;
  buyAmount: number;
  destinationCurrency: string;
  sourceCurrency: string;
  lastChanged: 'spend' | 'buy';
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

type ProviderQuotesProps = RadioGroupProps & {
  quotes: ProviderQuoteData[];
  selectedProvider?: string;
  onProviderSelect?: (providerId: string) => void;
  isLoading?: boolean;
};

// Helper function to calculate amounts based on quote rate
function calculateAmounts(
  quote: QuoteRateResponse,
  spendAmount: number,
  buyAmount: number,
  destinationCurrency: string,
  sourceCurrency: string,
  lastChanged: 'spend' | 'buy',
) {
  const rate = parseFloat(quote.rate);

  // Calculate what the amounts would be with this provider's rate
  let calculatedBuyAmount: number;
  let calculatedSpendAmount: number;

  if (lastChanged === 'spend') {
    calculatedBuyAmount = spendAmount * rate;
    calculatedSpendAmount = spendAmount;
  } else {
    calculatedBuyAmount = buyAmount;
    calculatedSpendAmount = buyAmount / rate;
  }

  return {
    buyAmountDisplay: `${calculatedBuyAmount.toFixed(2)} ${destinationCurrency}`,
    spendAmountDisplay: `${sourceCurrency}${calculatedSpendAmount.toFixed(2)}`,
  };
}

// Helper function to get provider logo
function getProviderLogo(providerName: string) {
  const logos = {
    hifi: <img src="/hifi.svg" alt="HiFi" width={55} height={20} />,
    transak: <img src="/transak.svg" alt="Transak" width={86} height={30} />,
    noah: <img src="/noah.svg" alt="Noah" width={70} height={20} />,
  };

  return logos[providerName as keyof typeof logos] || null;
}

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

export function ProviderQuotes({
  quotes,
  selectedProvider,
  onProviderSelect,
  isLoading = false,
  ...props
}: ProviderQuotesProps) {
  // Sort quotes by rate (best rate first - highest rate gives most tokens for same spend amount)
  const sortedQuotes = useMemo(() => {
    if (quotes.length === 0) return [];

    return [...quotes]
      .filter(
        (quoteData) => quoteData && quoteData.quote && quoteData.quote.rate,
      )
      .sort((a, b) => {
        const rateA = parseFloat(a.quote.rate);
        const rateB = parseFloat(b.quote.rate);
        return rateB - rateA;
      });
  }, [quotes]);

  // Find the best rate (highest rate means best conversion)
  const bestRateQuote = sortedQuotes.length > 0 ? sortedQuotes[0] : null;

  return (
    <div className="flex flex-col gap-5 flex-1 max-w-md">
      <h3 className="text-lg font-heading">Provider Quotes</h3>
      <p className="text-muted-foreground text-sm">
        Compare rates from these providers.
      </p>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {/* Show 3 skeleton loaders to represent the typical number of providers */}
          <ProviderSkeleton />
          <ProviderSkeleton />
          <ProviderSkeleton />
        </div>
      ) : (
        <RadioGroup
          className="flex flex-col gap-2"
          value={selectedProvider}
          {...props}
        >
          {sortedQuotes.map((quoteData) => {
            const { buyAmountDisplay, spendAmountDisplay } = calculateAmounts(
              quoteData.quote,
              quoteData.spendAmount,
              quoteData.buyAmount,
              quoteData.destinationCurrency,
              quoteData.sourceCurrency,
              quoteData.lastChanged,
            );

            const isBestRate =
              quoteData.quote.name === bestRateQuote?.quote.name;

            return (
              <Provider
                key={quoteData.quote.name}
                data={{
                  id: quoteData.quote.name,
                  name: quoteData.quote.name,
                  amount: buyAmountDisplay,
                  price: spendAmountDisplay,
                  isBestRate,
                }}
                onSelect={(id) => {
                  onProviderSelect?.(id);
                }}
                children={getProviderLogo(quoteData.quote.name)}
              />
            );
          })}
        </RadioGroup>
      )}
    </div>
  );
}
