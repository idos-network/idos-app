import { NearWalletContext } from '@/providers/wallet-providers/near-provider';
import { useContext } from 'react';

export function useNearWallet() {
  const context = useContext(NearWalletContext);

  if (!context) {
    throw new Error(
      '`useNearWallet` must be used within a `NearWalletProvider`',
    );
  }

  return context;
}
