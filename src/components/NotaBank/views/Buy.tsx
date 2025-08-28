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
import { useSharedStore } from '@/stores/shared-store';
import { useNavigate } from '@tanstack/react-router';
import { TokenETH, TokenUSDC, TokenUSDT } from '@web3icons/react';
import { EuroIcon } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import ActionToolbar from '../components/ActionToolbar';
import AmountInput from '../components/AmountInput';
import { providerLogos, ProviderQuotes } from '../components/ProviderQuotes';
import UserBalance from '../components/UserBalance';

export const SpendInput = () => {
  const { selectedCurrency, spendAmount, setSpendAmount, setSelectedCurrency } =
    useSharedStore();

  return (
    <div className="flex flex-col gap-3">
      <Label className="text-muted-foreground text-sm" htmlFor="spend-amount">
        I want to spend
      </Label>
      <div className="flex items-center gap-2">
        <AmountInput
          className="flex-1"
          id="spend-amount"
          value={+spendAmount}
          onInput={(e) => {
            const value = (e.target as unknown as { value: string }).value ?? 0;
            setSpendAmount(+value as number);
          }}
          rightSlot={
            <Select
              value={selectedCurrency}
              onValueChange={(value) => setSelectedCurrency(value)}
            >
              <SelectTrigger className="border-0 bg-transparent! shadow-none px-0 py-0 h-auto text-white text-base font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">
                  <span>USD</span>
                </SelectItem>
                <SelectItem value="EUR">
                  <EuroIcon className="size-6" />
                  <span>EUR</span>
                </SelectItem>
              </SelectContent>
            </Select>
          }
        />
      </div>
    </div>
  );
};

export const BuyInput = () => {
  const { selectedToken, buyAmount, setBuyAmount, setSelectedToken } =
    useSharedStore();

  return (
    <div className="flex flex-col gap-3">
      <Label className="text-muted-foreground text-sm" htmlFor="buy-amount">
        I want to buy
      </Label>
      <div className="flex items-center gap-2">
        <AmountInput
          className="flex-1"
          id="buy-amount"
          value={+buyAmount}
          onInput={(e) => {
            const value = (e.target as unknown as { value: string }).value ?? 0;
            setBuyAmount(+value as number);
          }}
          rightSlot={
            <Select
              value={selectedToken}
              onValueChange={(value) => setSelectedToken(value)}
            >
              <SelectTrigger className="border-0 bg-transparent! shadow-none px-0 py-0 h-auto text-white text-base font-semibold">
                <SelectValue />
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
          }
        />
      </div>
    </div>
  );
};

function BuyModule() {
  const {
    data: sharedCredential,
    isLoading: fetchingCredential,
    isError,
  } = useSharedCredential();
  const navigate = useNavigate();
  const { selectedProvider } = useSharedStore();

  useEffect(() => {
    if (fetchingCredential) {
      toast.loading('Checking shared credential...');
    } else if (isError) {
      toast.error('Shared credential not found');
    }
    toast.dismiss();
  }, [fetchingCredential, isError]);

  return (
    <div className="flex flex-col gap-5 p-6 bg-[#26262699] rounded-3xl flex-1 max-w-md ">
      <h3 className="text-xl font-heading">Buy Tokens</h3>
      <form className="flex flex-col gap-5">
        <SpendInput />
        <BuyInput />
        {sharedCredential?.credentialContent ? (
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate({ to: '/notabank/onramp' })}
          >
            Continue
          </Button>
        ) : (
          <Button
            type="button"
            variant="secondary"
            disabled={fetchingCredential}
            onClick={() => navigate({ to: '/notabank/kyc' })}
          >
            Continue
          </Button>
        )}
        {/* Powered by {provider} */}
        <div className="flex justify-center items-center gap-2">
          <span className="text-xs text-neutral-100 text-center">
            Powered by
          </span>
          {providerLogos[selectedProvider as keyof typeof providerLogos]}
        </div>
      </form>
    </div>
  );
}

export default function Buy() {
  const { buyAmount, spendAmount } = useSharedStore();
  const hasAmount = buyAmount > 0 || spendAmount > 0;
  return (
    <div className="flex flex-col justify-center w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center w-full h-[60px] gap-5">
        <UserBalance />
        <ActionToolbar />
      </div>
      <div
        className={`mt-10 flex  gap-5 w-full max-w-4xl mx-auto ${
          hasAmount ? 'justify-between' : 'justify-center'
        }`}
      >
        <BuyModule />
        <ProviderQuotes />
      </div>
    </div>
  );
}
