import { XrplWalletContext } from '@/providers/wallet-providers/xrpl-provider';
import { useContext } from 'react';

export function useXrplWallet() {
  const context = useContext(XrplWalletContext);
  if (!context) {
    throw new Error(
      '`useXrplWallet` must be used within a `XrplWalletProvider`',
    );
  }
  return context;
}
