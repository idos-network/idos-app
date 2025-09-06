import type { Country } from '@/hooks/useCountries';
import { create } from 'zustand';

export interface Token {
  symbol: string;
  name: string;
  balance: string;
  network: string;
  icon?: string;
}

interface SellTokenStore {
  selectedCountry: Country | null;
  setSelectedCountry: (selectedCountry: Country | null) => void;
  selectedToken: Token | null;
  setSelectedToken: (token: Token | null) => void;
  amount: string;
  setAmount: (amount: string) => void;
}

export const useSellTokenStore = create<SellTokenStore>((set) => ({
  selectedCountry: null,
  setSelectedCountry: (selectedCountry) => set({ selectedCountry }),
  selectedToken: {
    symbol: 'ETH',
    name: 'Ethereum',
    balance: '0',
    network: 'Polygon Mainnet',
    icon: '🔵', // Placeholder, can be updated with actual icon
  },
  setSelectedToken: (token) => set({ selectedToken: token }),
  amount: '0',
  setAmount: (amount) => set({ amount }),
}));
