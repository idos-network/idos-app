import { NearWalletContext } from '@/context/near-context';
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
