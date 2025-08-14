import { getNoahOnRampUrl } from '@/api/noah';
import { getSharedCredential } from '@/api/shared-credential';
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
import { useNavigate } from '@tanstack/react-router';
import { TokenETH, TokenUSDC, TokenUSDT } from '@web3icons/react';
import { DollarSignIcon, EuroIcon, FlameIcon } from 'lucide-react';
import ActionToolbar from '../components/ActionToolbar';
import AmountInput from '../components/AmountInput';
import OnRampDialog from '../components/OnRampDialog';
import { ProviderQuotes } from '../components/ProviderQuotes';
import UserBalance from '../components/UserBalance';

// @ts-expect-error keep these until tested in prod
window.getSharedCredential = getSharedCredential;
// @ts-expect-error keep these until tested in prod
window.getNoahCustomer = getNoahOnRampUrl;

function BuyModule() {
  const { data: sharedCredential } = useSharedCredential();
  const navigate = useNavigate();
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
            <AmountInput className="flex-1" id="spend-amount" />
            <Select>
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usd">
                  <DollarSignIcon className="size-5" />
                  <span>USD</span>
                </SelectItem>
                <SelectItem value="eur">
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
            <AmountInput className="flex-1" id="buy-amount" />
            <Select>
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usdc">
                  <TokenUSDC className="size-8" />
                  <span>USDC</span>
                </SelectItem>
                <SelectItem value="usdt">
                  <TokenUSDT className="size-8" />
                  <span>USDT</span>
                </SelectItem>
                <SelectItem value="eth">
                  <TokenETH className="size-8" />
                  <span>ETH</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <ProviderQuotes />
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
