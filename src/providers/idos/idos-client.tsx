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

  useEffect(() => {
    const setupClient = async () => {
      setIsLoading(true);

      try {
        const newClient = await _idOSClient.createClient();
        if (!evmSigner) {
          setClient(newClient);
          setWithSigner(undefined);
          setIsLoading(false);
          return;
        }

        const _withSigner = await newClient.withUserSigner(evmSigner);
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
  }, [evmSigner]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-950">
        <h1>initializing idOS...</h1>
      </div>
    );
  }

  return (
    <IDOSClientContext.Provider
      value={{ idOSClient: idOSClient, withSigner: withSigner!, isLoading }}
    >
      {children}
    </IDOSClientContext.Provider>
  );
}
