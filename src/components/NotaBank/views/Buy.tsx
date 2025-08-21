import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSharedCredential } from '@/hooks/useSharedCredential';
import { useQueries } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { TokenETH, TokenUSDC, TokenUSDT } from '@web3icons/react';
import type { QuoteRateResponse } from 'functions/provider-quotes';
import { DollarSignIcon, EuroIcon, FlameIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import ActionToolbar from '../components/ActionToolbar';
import AmountInput from '../components/AmountInput';
import OnRampDialog from '../components/OnRampDialog';
import { ProviderQuotes } from '../components/ProviderQuotes';
import UserBalance from '../components/UserBalance';

const providers = ['hifi', 'transak', 'noah'];

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

function BuyModule() {
  const { data: sharedCredential } = useSharedCredential();
  const navigate = useNavigate();
  const [sourceCurrency, setSourceCurrency] = useState('USD');
  const [buyAmount, setBuyAmount] = useState(100);
  const [spendAmount, setSpendAmount] = useState(100);
  const [destinationCurrency, setDestinationCurrency] = useState('USDC');
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [lastChanged, setLastChanged] = useState<'spend' | 'buy'>('spend');

  const quotes = useFetchProviderQuotes({
    sourceCurrency,
    destinationCurrency,
  });

  useEffect(() => {
    if (quotes.data && quotes.data.length > 0 && !selectedProvider) {
      const validQuotes = quotes.data.filter(
        (quote): quote is QuoteRateResponse =>
          Boolean(quote && quote.name && quote.rate),
      );
      if (validQuotes.length > 0) {
        const bestProvider = validQuotes.reduce((best, current) => {
          const currentRate = parseFloat(current.rate);
          const bestRate = parseFloat(best.rate);
          return currentRate > bestRate ? current : best;
        });

        setSelectedProvider(bestProvider.name);
        // Calculate initial buy amount
        const rate = parseFloat(bestProvider.rate);
        setBuyAmount(spendAmount * rate);
      }
    }
  }, [quotes.data, selectedProvider, spendAmount]);

  const handleSpendAmountChange = (value: number | null) => {
    const newSpendAmount = value ?? 0;
    setSpendAmount(newSpendAmount);
    setLastChanged('spend');

    if (selectedProvider && quotes.data) {
      const selectedQuote = quotes.data.find(
        (quote) => quote?.name === selectedProvider,
      );
      if (selectedQuote && selectedQuote.rate) {
        const rate = parseFloat(selectedQuote.rate);
        setBuyAmount(newSpendAmount * rate);
      }
    }
  };

  const handleBuyAmountChange = (value: number | null) => {
    const newBuyAmount = value ?? 0;
    setBuyAmount(newBuyAmount);
    setLastChanged('buy');

    if (selectedProvider && quotes.data) {
      const selectedQuote = quotes.data.find(
        (quote) => quote?.name === selectedProvider,
      );
      if (selectedQuote && selectedQuote.rate) {
        const rate = parseFloat(selectedQuote.rate);
        setSpendAmount(newBuyAmount / rate);
      }
    }
  };

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId);

    if (quotes.data) {
      const selectedQuote = quotes.data.find(
        (quote) => quote?.name === providerId,
      );

      if (selectedQuote && selectedQuote.rate) {
        const rate = parseFloat(selectedQuote.rate);
        if (lastChanged === 'spend') {
          setBuyAmount(spendAmount * rate);
        } else {
          setSpendAmount(buyAmount / rate);
        }
      }
    }
  };

  return (
    <div className="flex flex-col gap-5 p-6 bg-neutral-900 rounded-2xl flex-1 max-w-md border border-neutral-700/50">
      <h3 className="text-xl font-heading">Buy Tokens</h3>
      <form className="flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <Label
            className="text-muted-foreground text-sm"
            htmlFor="spend-amount"
          >
            I want to spend
          </Label>
          <div className="flex items-center gap-2">
            <AmountInput
              className="flex-1"
              id="spend-amount"
              value={spendAmount}
              onValueChange={handleSpendAmountChange}
            />
            <Select
              value={sourceCurrency}
              onValueChange={(value) => setSourceCurrency(value)}
            >
              <SelectTrigger className="w-32 min-w-32 shrink-0">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">
                  <DollarSignIcon className="size-5" />
                  <span>USD</span>
                </SelectItem>
                <SelectItem value="EUR">
                  <EuroIcon className="size-5" />
                  <span>EUR</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Label className="text-muted-foreground text-sm" htmlFor="buy-amount">
            I want to buy
          </Label>
          <div className="flex items-center gap-2">
            <AmountInput
              className="flex-1"
              id="buy-amount"
              value={buyAmount}
              onValueChange={handleBuyAmountChange}
            />
            <Select
              value={destinationCurrency}
              onValueChange={(value) => setDestinationCurrency(value)}
            >
              <SelectTrigger className="w-32 min-w-32 shrink-0">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USDC">
                  <TokenUSDC className="size-6" />
                  <span>USDC</span>
                </SelectItem>
                <SelectItem value="USDT">
                  <TokenUSDT className="size-6" />
                  <span>USDT</span>
                </SelectItem>
                <SelectItem value="ETH">
                  <TokenETH className="size-6" />
                  <span>ETH</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <ProviderQuotes
          quotes={
            quotes.data
              ? quotes.data
                  .filter((quote): quote is QuoteRateResponse =>
                    Boolean(quote && quote.name && quote.rate),
                  )
                  .map((quote) => ({
                    quote: quote,
                    spendAmount,
                    buyAmount,
                    destinationCurrency,
                    sourceCurrency,
                    lastChanged,
                  }))
              : []
          }
          selectedProvider={selectedProvider}
          onProviderSelect={handleProviderSelect}
          isLoading={quotes.isPending}
        />
        <div className="flex flex-col gap-1">
          <p className="text-sm">Gas Fee</p>
          <p className="text-sm flex items-center gap-1 justify-between">
            <span>
              1 USD = 0.000005859 ETH
              <span className="text-neutral-400">($1,632)</span>
            </span>
            <span className="flex items-center gap-1">
              <FlameIcon className="size-4 text-yellow-500" />
              $15.99
            </span>
          </p>
        </div>
        {sharedCredential?.credentialContent ? (
          <OnRampDialog />
        ) : (
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate({ to: '/notabank/kyc' })}
          >
            Continue
          </Button>
        )}
      </form>
    </div>
  );
}

export default function Buy() {
  return (
    <div className="flex flex-col justify-center w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center w-full h-[60px] gap-5">
        <UserBalance />
        <ActionToolbar />
      </div>
      <div className="mt-10 flex place-content-center items-center gap-5 w-full max-w-4xl mx-auto">
        <BuyModule />
      </div>
    </div>
  );
}
