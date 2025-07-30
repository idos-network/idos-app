import { WalletConnectorContext } from '@/context/wallet-connector-context';
import { useContext } from 'react';

export function useWalletConnector() {
  const context = useContext(WalletConnectorContext);

  if (!context) {
    throw new Error(
      '`useWalletConnector` must be used within a `WalletConnectorProvider`',
    );
  }

  return context;
}
