import { type PropsWithChildren, createContext, useMemo } from 'react';
import { useRainbowKit } from '../../hooks/useRainbowKit';
import { useNearWallet } from '../../hooks/useNearWallet';

export type WalletType = 'ethereum' | 'near' | 'stellar';

export interface ConnectedWallet {
  type: WalletType;
  address: string;
  disconnect: () => Promise<void> | void;
}

export interface WalletConnectorContextValue {
  connectedWallet: ConnectedWallet | null;
  isConnected: boolean;

  connectEthereum: () => Promise<void>;
  connectNear: () => Promise<void>;

  disconnect: () => Promise<void>;

  ethereumWallet: ReturnType<typeof useRainbowKit>;
  nearWallet: ReturnType<typeof useNearWallet>;
}

export const WalletConnectorContext =
  createContext<WalletConnectorContextValue | null>(null);

export function WalletConnectorProvider({ children }: PropsWithChildren) {
  const ethereumWallet = useRainbowKit();
  const nearWallet = useNearWallet();

  const contextValue = useMemo<WalletConnectorContextValue>(() => {
    const disconnectAll = async () => {
      const promises: Promise<void>[] = [];

      if (ethereumWallet.isConnected) {
        promises.push(Promise.resolve(ethereumWallet.disconnect()));
      }

      if (nearWallet.selector.isSignedIn()) {
        promises.push(
          nearWallet.selector.wallet().then((wallet) => wallet.signOut()),
        );
      }

      await Promise.all(promises);
    };
    let connectedWallet: ConnectedWallet | null = null;

    if (ethereumWallet.isConnected && ethereumWallet.address) {
      connectedWallet = {
        type: 'ethereum',
        address: ethereumWallet.address,
        disconnect: ethereumWallet.disconnect,
      };
    } else if (nearWallet.selector.isSignedIn() && nearWallet.accountId) {
      connectedWallet = {
        type: 'near',
        address: nearWallet.accountId,
        disconnect: async () => {
          const wallet = await nearWallet.selector.wallet();
          await wallet.signOut();
        },
      };
    }

    return {
      connectedWallet,
      isConnected: connectedWallet !== null,

      connectEthereum: async () => {
        await disconnectAll();
        ethereumWallet.openConnectModal?.();
      },
      connectNear: async () => {
        await disconnectAll();
        nearWallet.modal.show();
      },

      disconnect: disconnectAll,

      ethereumWallet,
      nearWallet,
    };
  }, [ethereumWallet, nearWallet]);

  return (
    <WalletConnectorContext.Provider value={contextValue}>
      {children}
    </WalletConnectorContext.Provider>
  );
}
