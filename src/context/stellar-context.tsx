import { StellarWalletsKit } from '@creit.tech/stellar-wallets-kit';
import React, { useContext } from 'react';

export interface StellarWalletContextValue {
  kit: StellarWalletsKit;
  address: string | null;
  publicKey: string | null;
  isConnected: boolean;
  isLoading: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

export const StellarWalletContext =
  React.createContext<StellarWalletContextValue | null>(null);

export function useStellarWallet() {
  const context = useContext(StellarWalletContext);

  if (!context) {
    throw new Error(
      '`useStellarWallet` must be used within a `StellarWalletProvider`',
    );
  }

  return context;
}
