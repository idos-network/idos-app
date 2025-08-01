import { useNavigate } from '@tanstack/react-router';
import { useBuyStore } from '@/stores/buy-store';
import {
  currencies,
  TokenAmountInput,
  tokens,
} from '@/components/NotaBank/components/TokenAmountInput';
import { PaymentMethod } from './PaymentMethod';
import { Button } from '@/components/ui/button';

export function BuyTokens() {
  const {
    spendAmount,
    setSpendAmount,
    setBuyAmount,
    buyAmount,
    selectedCurrency,
    setSelectedCurrency,
    selectedToken,
    setSelectedToken,
  } = useBuyStore();

  const navigate = useNavigate();

  return (
    <div className="flex max-w-[500px] flex-1 flex-col gap-6 rounded-2xl bg-card p-6 bg-[#26262699]">
      <h1 className="mb-6 font-medium text-3xl">Buy Tokens</h1>
      <div className="flex flex-col gap-4 border-muted-foreground border-b pb-6">
        <TokenAmountInput
          selectOptions={currencies}
          value={spendAmount}
          onValueChange={setSpendAmount}
          selectedValue={selectedCurrency}
          setSelectedValue={setSelectedCurrency}
          label="I want to spend"
        />
        <TokenAmountInput
          selectOptions={tokens}
          value={buyAmount}
          onValueChange={setBuyAmount}
          selectedValue={selectedToken}
          setSelectedValue={setSelectedToken}
          label="I want to buy"
        />
      </div>

      <PaymentMethod />

      <Button
        disabled={
          !+spendAmount || !+buyAmount || !selectedCurrency || !selectedToken
        }
        className="h-12 w-full rounded-lg bg-[#74FB5B] text-black"
        onClick={() => navigate({ to: '/notabank' })}
      >
        Continue
      </Button>
    </div>
  );
}
