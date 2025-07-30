import { createContext } from 'react';

export interface XrplWalletContextValue {
  address: string | null;
  publicKey: string | null;
  isConnected: boolean;
  isLoading: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

export const XrplWalletContext = createContext<XrplWalletContextValue | null>(
  null,
);
