import * as GemWallet from '@gemwallet/api';
import {
  createIDOSClient,
  type idOSClient,
  idOSClientWithUserSigner,
} from '@idos-network/client';
import { type PropsWithChildren, useContext, useEffect, useState } from 'react';

import { IDOSClientContext } from '@/context/idos-context';
import { WalletConnectorContext } from '@/context/wallet-connector-context';
import { env } from '@/env';
import { handleSaveUserWallets } from '@/handlers/user-wallets';
import { useAuth } from '@/hooks/useAuth';
import { useEthersSigner } from '@/hooks/useEthersSigner';
import type { IdosWallet } from '@/interfaces/idos-profile';
import { useSharedStore } from '@/stores/shared-store';
import { createStellarSigner } from '@/utils/stellar/stellar-signature';
import { useQueryClient } from '@tanstack/react-query';

const _idOSClient = createIDOSClient({
  nodeUrl: env.VITE_IDOS_NODE_URL,
  enclaveOptions: {
    container: '#idOS-enclave',
    url: env.VITE_IDOS_ENCLAVE_URL,
  },
});

export function IDOSClientProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(true);
  const [idOSClient, setClient] = useState<idOSClient>(_idOSClient);
  const [withSigner, setWithSigner] = useState<idOSClientWithUserSigner>();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const evmSigner = useEthersSigner();
  const walletConnector = useContext(WalletConnectorContext);
  const { resetStore } = useSharedStore();
  const { authenticate, isAuthenticated } = useAuth();

  const refresh = async () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    if (!walletConnector?.isConnected) {
      queryClient.removeQueries({ queryKey: ['shared-credential'] });
    }
  }, [walletConnector?.isConnected, queryClient]);

  useEffect(() => {
    if (!walletConnector?.connectedWallet) {
      resetStore();
    }
  }, [walletConnector]);

  useEffect(() => {
    const setupClient = async () => {
      if (!['with-user-signer', 'logged-in'].includes(idOSClient.state)) {
        setIsLoading(true);
      }
      try {
        const newClient = await _idOSClient.createClient();
        let _signer: any = undefined;
        if (walletConnector?.connectedWallet) {
          if (walletConnector.connectedWallet.type === 'evm') {
            _signer = evmSigner;
          } else if (walletConnector.connectedWallet.type === 'near') {
            const nearWallet = walletConnector.nearWallet;
            if (nearWallet?.selector.isSignedIn()) {
              _signer = await nearWallet.selector.wallet();
            }
          } else if (walletConnector.connectedWallet.type === 'stellar') {
            const stellarWallet = walletConnector.stellarWallet;
            if (
              stellarWallet?.isConnected &&
              stellarWallet.address &&
              stellarWallet.kit
            ) {
              _signer = await createStellarSigner(
                stellarWallet.publicKey as string,
                stellarWallet.address as string,
              );
            }
          } else if (walletConnector.connectedWallet.type === 'xrpl') {
            const xrplWallet = walletConnector.xrplWallet;
            if (xrplWallet?.isConnected && xrplWallet.address) {
              _signer = GemWallet;
            }
          }
        }
        if (!_signer) {
          setClient(newClient);
          setWithSigner(undefined);
          setIsLoading(false);
          return;
        }

        const _withSigner = await newClient.withUserSigner(_signer);
        setWithSigner(_withSigner);
        if (await _withSigner.hasProfile()) {
          const client = await _withSigner.logIn();
          const userWallets = await client.getWallets();
          const walletsArray = userWallets as IdosWallet[];
          handleSaveUserWallets(client.user.id, walletsArray);
          if (!isAuthenticated) {
            await authenticate();
          }
          setClient(client);
        } else {
          setClient(_withSigner);
        }
      } catch (error) {
        console.error('Failed to initialize idOS client:', error);
        const newClient = await _idOSClient.createClient();
        setClient(newClient);
        setWithSigner(undefined);
      } finally {
        setIsLoading(false);
      }
    };
    setupClient();

    // Removing wallet dependencies to prevent reinitialization on connection failures
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletConnector?.connectedWallet, refreshTrigger]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-950">
        <h1>initializing idOS...</h1>
      </div>
    );
  }

  return (
    <IDOSClientContext.Provider
      value={{
        idOSClient: idOSClient,
        setIdOSClient: setClient,
        withSigner: withSigner!,
        isLoading,
        refresh,
      }}
    >
      {children}
    </IDOSClientContext.Provider>
  );
}
