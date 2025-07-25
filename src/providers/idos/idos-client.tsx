import {
  createIDOSClient,
  type idOSClient,
  idOSClientWithUserSigner,
} from '@idos-network/client';
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import * as GemWallet from '@gemwallet/api';

import { useEthersSigner } from '@/hooks/useEthersSigner';
import { WalletConnectorContext } from '@/providers/wallet-providers/wallet-connector';
import { createStellarSigner } from '@/utils/stellar/stellar-signature';

const _idOSClient = createIDOSClient({
  nodeUrl: 'https://nodes.playground.idos.network/',
  enclaveOptions: { container: '#idOS-enclave' },
});

type IdOSContextType = {
  idOSClient: idOSClient;
  withSigner: idOSClientWithUserSigner;
  isLoading: boolean;
};

export const IDOSClientContext = createContext<IdOSContextType | undefined>(
  undefined,
);

export const useIdOS = () => {
  const context = useContext(IDOSClientContext);
  if (!context) {
    throw new Error('useIdOS must be used within an IdOSProvider');
  }
  return context;
};

export const useUnsafeIdOS = () => {
  return useContext(IDOSClientContext);
};

export function IDOSClientProvider({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(true);
  const [idOSClient, setClient] = useState<idOSClient>(_idOSClient);
  const [withSigner, setWithSigner] = useState<idOSClientWithUserSigner>();
  const evmSigner = useEthersSigner();
  const walletConnector = useContext(WalletConnectorContext);

  useEffect(() => {
    const setupClient = async () => {
      setIsLoading(true);
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
          setClient(await _withSigner.logIn());
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    evmSigner,
    walletConnector?.connectedWallet,
    walletConnector?.nearWallet,
    walletConnector?.stellarWallet,
    // Removing xrplWallet from dependencies to prevent reinitialization on connection failures
    // walletConnector?.xrplWallet,
  ]);

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
        withSigner: withSigner!,
        isLoading,
      }}
    >
      {children}
    </IDOSClientContext.Provider>
  );
}
