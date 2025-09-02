import * as GemWallet from '@gemwallet/api';
import { type PropsWithChildren, useContext, useEffect } from 'react';

import { WalletConnectorContext } from '@/context/wallet-connector-context';
import { handleSaveUserWallets } from '@/handlers/user-wallets';
import { useEthersSigner } from '@/hooks/useEthersSigner';
import type { IdosWallet } from '@/interfaces/idos-profile';
import { removeUserFromLocalStorage } from '@/storage/idos-profile';
import { _idOSClient, useIdosStore } from '@/stores/idosStore';
import { createStellarSigner } from '@/utils/stellar/stellar-signature';
import { useQueryClient } from '@tanstack/react-query';

export function IDOSClientProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const evmSigner = useEthersSigner();
  const walletConnector = useContext(WalletConnectorContext);

  const { idOSClient, setIdOSClient, initializing } = useIdosStore();

  useEffect(() => {
    if (!walletConnector?.isConnected) {
      queryClient.removeQueries({ queryKey: ['shared-credential'] });
      removeUserFromLocalStorage();
    }
  }, [walletConnector?.isConnected, queryClient]);

  useEffect(() => {
    if (idOSClient || !walletConnector?.connectedWallet || !evmSigner) return;

    const setupClient = async () => {
      try {
        console.log('setupClient');
        const client = await _idOSClient.createClient();
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

        if (client.state === 'idle') {
          const _withSigner = await client.withUserSigner(_signer);
          // setWithSigner(_withSigner);
          if (await _withSigner.hasProfile()) {
            const client = await _withSigner.logIn();
            const userWallets = await client.getWallets();
            const walletsArray = userWallets as IdosWallet[];
            handleSaveUserWallets(client.user.id, walletsArray);
            setIdOSClient(client);
          } else {
            setIdOSClient(_withSigner);
          }
        }
      } catch (error) {
        console.error('Failed to initialize idOS client:', error);
      }
    };
    setupClient();
    // Removing wallet dependencies to prevent reinitialization on connection failures
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletConnector?.isConnected, evmSigner]);

  if (initializing) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-950">
        <h1>initializing idOS...</h1>
      </div>
    );
  }

  return <>{children}</>;
}
