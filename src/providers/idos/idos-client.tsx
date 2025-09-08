import * as GemWallet from '@gemwallet/api';
import { type PropsWithChildren, useContext, useEffect } from 'react';

import { WalletConnectorContext } from '@/context/wallet-connector-context';
import { handleSaveUserWallets } from '@/handlers/user-wallets';
import { useEthersSigner } from '@/hooks/useEthersSigner';
import type { IdosWallet } from '@/interfaces/idos-profile';
import { _idOSClient, useIdosStore } from '@/stores/idosStore';
import { loginBackend } from '@/utils/api-auth';
import { createStellarSigner } from '@/utils/stellar/stellar-signature';
import { useQuery } from '@tanstack/react-query';

const useSigner = () => {
  const walletConnector = useContext(WalletConnectorContext);
  const evmSigner = useEthersSigner();

  const enabledCondition = walletConnector?.isConnected
    ? walletConnector?.connectedWallet?.type === 'evm'
      ? !!evmSigner
      : !!walletConnector.connectedWallet
    : false;

  return useQuery({
    queryKey: ['signer', walletConnector?.connectedWallet?.address],
    enabled: enabledCondition,
    queryFn: async () => {
      try {
        if (
          !walletConnector?.isConnected ||
          !walletConnector?.connectedWallet
        ) {
          return null;
        }

        let _signer: any = null;
        if (walletConnector.connectedWallet.type === 'evm' && evmSigner) {
          _signer = evmSigner;
        }
        if (walletConnector.connectedWallet.type === 'near') {
          const nearWallet = walletConnector.nearWallet;
          if (nearWallet?.selector.isSignedIn()) {
            _signer = await nearWallet.selector.wallet();
          }
        }
        if (walletConnector.connectedWallet.type === 'stellar') {
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
        }
        if (walletConnector.connectedWallet.type === 'xrpl') {
          const xrplWallet = walletConnector.xrplWallet;
          if (xrplWallet?.isConnected && xrplWallet.address) {
            return GemWallet;
          }
        }
        return _signer;
      } catch (error) {
        return null;
      }
    },
  });
};

export function IDOSClientProvider({ children }: PropsWithChildren) {
  const { data: signer, isLoading: isLoadingSigner } = useSigner();
  const walletConnector = useContext(WalletConnectorContext);

  const { idOSClient, setIdOSClient, initializing, setSettingSigner } =
    useIdosStore();

  useEffect(() => {
    if (idOSClient || !signer || isLoadingSigner) return;

    const setupClient = async () => {
      try {
        setSettingSigner(true);
        console.log('setupClient');
        const client = await _idOSClient.createClient();
        if (client.state === 'idle') {
          const _withSigner = await client.withUserSigner(signer);
          // setWithSigner(_withSigner);
          if (await _withSigner.hasProfile()) {
            const client = await _withSigner.logIn();
            const userWallets = await client.getWallets();
            const walletsArray = userWallets as IdosWallet[];
            handleSaveUserWallets(client.user.id, walletsArray);
            setIdOSClient(client);

            // Authenticate with backend using the connected wallet
            try {
              if (walletConnector?.isConnected && walletConnector?.connectedWallet) {
                const { address, type } = walletConnector.connectedWallet;
                
                // Create signer function based on wallet type
                const signMessage = async (message: string) => {
                  if (type === 'evm' && signer) {
                    return await signer.signMessage(message);
                  } else if (type === 'near') {
                    const nearWallet = walletConnector.nearWallet;
                    if (nearWallet?.selector.isSignedIn()) {
                      const wallet = await nearWallet.selector.wallet();
                      return await wallet.signMessage({ message });
                    }
                  } else if (type === 'stellar') {
                    const stellarWallet = walletConnector.stellarWallet;
                    if (stellarWallet?.isConnected && stellarWallet.kit) {
                      return await stellarWallet.kit.signMessage(message);
                    }
                  } else if (type === 'xrpl') {
                    const xrplWallet = walletConnector.xrplWallet;
                    if (xrplWallet?.isConnected) {
                      return await GemWallet.signMessage(message);
                    }
                  }
                  throw new Error('Unable to sign message with current wallet');
                };

                // Get public keys for non-EVM wallets
                const public_key = type !== 'evm' ? [address] : undefined;

                await loginBackend({
                  address,
                  walletType: type,
                  signMessage,
                  public_key,
                });
              }
            } catch (error) {
              console.error('Failed to authenticate with backend:', error);
              // Don't fail the idOS setup if backend auth fails
            }
          } else {
            setIdOSClient(_withSigner);
          }
        }
      } catch (error) {
        console.error('Failed to initialize idOS client:', error);
      } finally {
        setSettingSigner(false);
      }
    };
    setupClient();
    // Removing wallet dependencies to prevent reinitialization on connection failures
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signer, isLoadingSigner, idOSClient]);

  if (initializing) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-950">
        <h1>initializing idOS...</h1>
      </div>
    );
  }

  return <>{children}</>;
}
