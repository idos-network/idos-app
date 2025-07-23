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

import { useEthersSigner } from '@/hooks/useEthersSigner';
import { WalletConnectorContext } from '@/providers/wallet-providers/wallet-connector';

const _idOSClient = createIDOSClient({
  nodeUrl: 'https://nodes.playground.idos.network/',
  enclaveOptions: { container: '#idOS-enclave' },
});

type IdOSContextType = {
  idOSClient: idOSClient;
  withSigner: idOSClientWithUserSigner;
  isLoading: boolean;
  signer: any; // Export the current active signer
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

async function createStellarSigner(address: string, kit: any) {
  // TODO: Implement stellar signer
  return { address, kit };
}

export function IDOSClientProvider({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(true);
  const [idOSClient, setClient] = useState<idOSClient>(_idOSClient);
  const [withSigner, setWithSigner] = useState<idOSClientWithUserSigner>();
  const [signer, setSigner] = useState<any>(); // Track the current signer
  const evmSigner = useEthersSigner();
  const walletConnector = useContext(WalletConnectorContext);

  useEffect(() => {
    const setupClient = async () => {
      setIsLoading(true);
      try {
        const newClient = await _idOSClient.createClient();
        let _signer: any = undefined;
        if (walletConnector?.connectedWallet) {
          if (walletConnector.connectedWallet.type === 'ethereum') {
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
                stellarWallet.address,
                stellarWallet.kit,
              );
            }
          }
        }
        setSigner(_signer); // Save the signer to state
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
        setSigner(undefined);
      } finally {
        setIsLoading(false);
      }
    };
    setupClient();
  }, [
    evmSigner,
    walletConnector?.connectedWallet,
    walletConnector?.nearWallet,
    walletConnector?.stellarWallet,
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
        signer,
      }}
    >
      {children}
    </IDOSClientContext.Provider>
  );
}
