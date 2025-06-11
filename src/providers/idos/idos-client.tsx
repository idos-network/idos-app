import { createIDOSClient, type idOSClient } from '@idos-network/client';
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

export const IDOSClientContext = createContext<idOSClient>(_idOSClient);

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
  const [client, setClient] = useState<idOSClient>(_idOSClient);
  const evmSigner = useEthersSigner();

  useEffect(() => {
    const setupClient = async () => {
      setIsLoading(true);

      try {
        // Always start with a fresh client
        const newClient = await _idOSClient.createClient();
        if (!evmSigner) {
          setClient(newClient);
          setIsLoading(false);
          return;
        }

        const withSigner = await newClient.withUserSigner(evmSigner);

        // Check if the user has a profile and log in if they do
        if (await withSigner.hasProfile()) {
          setClient(await withSigner.logIn());
        } else {
          setClient(withSigner);
        }
      } catch (error) {
        console.error('Failed to initialize idOS client:', error);
        const newClient = await _idOSClient.createClient();
        setClient(newClient);
      } finally {
        setIsLoading(false);
      }
    };

    setupClient();
  }, [evmSigner]);

  // While loading, show a message
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h1>initializing idOS...</h1>
      </div>
    );
  }

  // Otherwise, render the children with the client context
  return (
    <IDOSClientContext.Provider value={client}>
      {children}
    </IDOSClientContext.Provider>
  );
}
