import {
  currencies,
  tokens,
} from '@/components/NotaBank/components/TokenAmountInput';
import type { idOSCredential } from '@idos-network/client';
import { create } from 'zustand';

interface SharedStore {
  spendAmount: number;
  buyAmount: number;
  setSpendAmount: (spendAmount: number) => void;
  setBuyAmount: (buyAmount: number) => void;
  rate: string;
  setRate: (rate: string) => void;
  selectedCurrency: string;
  setSelectedCurrency: (selectedCurrency: string) => void;
  selectedToken: string;
  setSelectedToken: (selectedToken: string) => void;
  lastChanged: 'spend' | 'buy';
  setLastChanged: (field: 'spend' | 'buy') => void;
  selectedProvider: string;
  setSelectedProvider: (selectedProvider: string) => void;
  sharedCredential: idOSCredential | null;
  setSharedCredential: (sharedCredential: idOSCredential | null) => void;
  resetStore: () => void;
}

export const useSharedStore = create<SharedStore>((set) => ({
  spendAmount: 100,
  buyAmount: 100,
  setBuyAmount: (buyAmount) => {
    const rate = useSharedStore.getState().rate || 1;
    const spendAmount = +buyAmount / +rate;
    set({ buyAmount, spendAmount, lastChanged: 'buy' });
  },
  setSpendAmount: (spendAmount) => {
    const rate = useSharedStore.getState().rate || 1;
    const buyAmount = +spendAmount * +rate;
    set({ spendAmount, buyAmount, lastChanged: 'spend' });
  },
  rate: '',
  setRate: (rate: string) => {
    const { spendAmount, buyAmount, lastChanged } = useSharedStore.getState();
    let newSpendAmount = spendAmount;
    let newBuyAmount = buyAmount;
    if (lastChanged === 'spend') {
      newBuyAmount = +spendAmount * +rate;
    } else if (lastChanged === 'buy') {
      newSpendAmount = +buyAmount / +rate;
    }
    set({ rate, spendAmount: newSpendAmount, buyAmount: newBuyAmount });
  },
  selectedCurrency: currencies[0].value,
  setSelectedCurrency: (selectedCurrency) => set({ selectedCurrency }),

  selectedToken: tokens[0].value,
  setSelectedToken: (selectedToken) => set({ selectedToken }),

  lastChanged: 'spend',
  setLastChanged: (field) => set({ lastChanged: field }),

  selectedProvider: '',
  setSelectedProvider: (selectedProvider) => set({ selectedProvider }),

  sharedCredential: null,
  setSharedCredential: (sharedCredential) => set({ sharedCredential }),
  resetStore: () =>
    set({
      spendAmount: 0,
      buyAmount: 0,
      rate: '',
      selectedCurrency: currencies[0].value,
      selectedToken: tokens[0].value,
      lastChanged: 'spend',
      selectedProvider: '',
      sharedCredential: null,
    }),
}));
