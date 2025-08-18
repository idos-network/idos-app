import { useStellarWallet } from '@/context/stellar-context';
import { useNearWallet } from '@/hooks/useNearWallet';
import { useRainbowKit } from '@/hooks/useRainbowKit';
import { useXrplWallet } from '@/hooks/useXRPLWallet';
import { createContext } from 'react';

export type WalletType = 'evm' | 'near' | 'stellar' | 'xrpl';

export interface ConnectedWallet {
  type: WalletType;
  address: string;
  publicKey: string | null;
  balance: bigint;
  network?: number;
  disconnect: () => Promise<void> | void;
}

export interface WalletConnectorContextValue {
  connectedWallet: ConnectedWallet | null;
  isConnected: boolean;

  connectEthereum: () => Promise<void>;
  connectNear: () => Promise<void>;
  connectStellar: () => Promise<void>;
  connectXRPL: () => Promise<void>;
  disconnect: () => Promise<void>;

  evmWallet: ReturnType<typeof useRainbowKit>;
  nearWallet: ReturnType<typeof useNearWallet>;
  stellarWallet: ReturnType<typeof useStellarWallet>;
  xrplWallet: ReturnType<typeof useXrplWallet>;
}

export const WalletConnectorContext =
  createContext<WalletConnectorContextValue | null>(null);
