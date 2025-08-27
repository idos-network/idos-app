import { BankIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { useSellTokenStore } from '@/stores/sell-token-store';
import { ChevronDown } from 'lucide-react';

export default function SellTokens() {
  const { selectedToken, amount, selectedCountry } = useSellTokenStore();

  if (!selectedToken) return null;

  return (
    <div className="flex flex-col gap-6 p-6 bg-neutral-900 rounded-2xl flex-1 max-w-md border border-neutral-700/50">
      {/* Header */}
      <h3 className="text-xl font-heading text-white">Sell Tokens</h3>

      {/* Token Amount Display */}
      <div className="flex flex-col items-center gap-4 py-8">
        <div className="text-center">
          <div className="text-5xl font-light text-white mb-2">
            {amount || '0'} {selectedToken.symbol}
          </div>
          <div className="text-neutral-400 text-sm">
            Balance: {selectedToken.balance} {selectedToken.symbol}
          </div>
        </div>
      </div>

      {/* Token Selector */}
      <button
        type="button"
        className="flex items-center justify-between h-[60px] px-6 bg-neutral-800 border  rounded-xl hover:bg-neutral-800/60 transition-colors"
        onClick={() => {
          // Will open token selector dialog
          console.log('Open token selector');
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">🔵</span>
          </div>
          <div className="text-left">
            <div className="text-white font-medium">{selectedToken.name}</div>
            <div className="text-neutral-400 text-sm">
              {selectedToken.network}
            </div>
          </div>
        </div>
        <ChevronDown className="w-5 h-5 text-neutral-400" />
      </button>

      {/* Payment Method */}
      <div className="flex gap-3 h-[60px]">
        <button
          type="button"
          className="flex flex-1 items-center justify-between px-6 bg-neutral-800 rounded-xl hover:bg-neutral-800/60 transition-colors"
          onClick={() => {
            // Will open payment method selector
            console.log('Open payment method selector');
          }}
        >
          <div className="flex items-center gap-3">
            <BankIcon />
            <div className="text-left">
              <div className="text-white font-medium">ACH Bank Transfer</div>
            </div>
          </div>
        </button>
        {/* Country Selector */}
        <div className="flex items-center gap-2 border border-neutral-500 rounded-xl p-4">
          {selectedCountry && (
            <img
              src={selectedCountry.flags.svg}
              alt={`${selectedCountry.name.common} flag`}
              className="w-6 h-5 object-cover rounded-sm"
            />
          )}
          <ChevronDown className="w-5 h-5 text-neutral-400" />
        </div>
      </div>

      {/* Amount Input */}
      {/* <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-300">
          Amount to sell
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="0.00"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            className="w-full h-14 px-4 bg-neutral-800/40 border border-neutral-700/50 rounded-xl text-white text-lg placeholder:text-neutral-400 focus:border-primary focus:outline-none"
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 text-sm">
            {selectedToken.symbol}
          </div>
        </div>
      </div> */}

      {/* Continue Button */}
      <Button
        type="button"
        className="w-full h-12 bg-green-500 hover:bg-green-600 text-black font-medium rounded-xl"
        disabled={!amount || amount === '0'}
      >
        Continue
      </Button>
    </div>
  );
}
