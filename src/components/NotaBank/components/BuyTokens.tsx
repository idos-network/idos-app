import { useBuyStore } from '@/stores/buy-store';
import {
  currencies,
  TokenAmountInput,
  tokens,
} from '@/components/NotaBank/components/TokenAmountInput';
import { PaymentMethod } from './PaymentMethod';
import KycSubmitDisclaimer from './KycSubmitDisclaimer';

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

      <KycSubmitDisclaimer
        spendAmount={+spendAmount}
        buyAmount={+buyAmount}
        selectedCurrency={selectedCurrency}
        selectedToken={selectedToken}
      />
    </div>
  );
}
