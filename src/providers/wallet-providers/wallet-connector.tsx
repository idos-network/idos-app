import { type PropsWithChildren, createContext, useMemo } from 'react';
import { useRainbowKit } from '@/hooks/useRainbowKit';
import { useNearWallet } from '@/hooks/useNearWallet';
import { useStellarWallet } from './stellar-provider';
import { useXrplWallet } from '@/hooks/useXRPLWallet';

export type WalletType = 'evm' | 'near' | 'stellar' | 'xrpl';

export interface ConnectedWallet {
  type: WalletType;
  address: string;
  publicKey: string | null;
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

export function WalletConnectorProvider({ children }: PropsWithChildren) {
  const evmWallet = useRainbowKit();
  const nearWallet = useNearWallet();
  const stellarWallet = useStellarWallet();
  const xrplWallet = useXrplWallet();

  const contextValue = useMemo<WalletConnectorContextValue>(() => {
    const disconnectAll = async () => {
      const promises: Promise<void>[] = [];

      if (evmWallet.isConnected) {
        promises.push(Promise.resolve(evmWallet.disconnect()));
      }

      if (nearWallet.selector.isSignedIn()) {
        promises.push(
          nearWallet.selector.wallet().then((wallet) => wallet.signOut()),
        );
      }

      if (stellarWallet.isConnected) {
        promises.push(stellarWallet.disconnect());
      }

      if (xrplWallet.isConnected) {
        promises.push(xrplWallet.disconnect());
      }

      await Promise.all(promises);
    };
    let connectedWallet: ConnectedWallet | null = null;

    if (evmWallet.isConnected && evmWallet.address) {
      connectedWallet = {
        type: 'evm',
        address: evmWallet.address,
        publicKey: evmWallet.address,
        disconnect: evmWallet.disconnect,
      };
    } else if (nearWallet.selector.isSignedIn() && nearWallet.accountId) {
      connectedWallet = {
        type: 'near',
        address: nearWallet.accountId,
        publicKey: nearWallet.publicKey,
        disconnect: async () => {
          const wallet = await nearWallet.selector.wallet();
          await wallet.signOut();
        },
      };
    } else if (stellarWallet.isConnected && stellarWallet.address) {
      connectedWallet = {
        type: 'stellar',
        address: stellarWallet.address,
        publicKey: stellarWallet.publicKey,
        disconnect: stellarWallet.disconnect,
      };
    } else if (xrplWallet.isConnected && xrplWallet.address) {
      connectedWallet = {
        type: 'xrpl',
        address: xrplWallet.address,
        publicKey: xrplWallet.publicKey,
        disconnect: xrplWallet.disconnect,
      };
    }

    return {
      connectedWallet,
      isConnected: !!connectedWallet,
      connectEthereum: async () => {
        await disconnectAll();
        evmWallet.openConnectModal?.();
      },
      connectNear: async () => {
        await disconnectAll();
        nearWallet.modal.show();
      },
      connectStellar: async () => {
        await disconnectAll();
        await stellarWallet.connect();
      },
      connectXRPL: async () => {
        await disconnectAll();
        await xrplWallet.connect();
      },
      disconnect: disconnectAll,
      evmWallet,
      nearWallet,
      stellarWallet,
      xrplWallet,
    };
  }, [evmWallet, nearWallet, stellarWallet, xrplWallet]);

  return (
    <WalletConnectorContext.Provider value={contextValue}>
      {children}
    </WalletConnectorContext.Provider>
  );
}
