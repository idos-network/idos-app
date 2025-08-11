import {
  type idOSClient,
  type idOSClientLoggedIn,
  type idOSClientWithUserSigner,
} from '@idos-network/client';
import { createContext, useContext } from 'react';

type IdOSContextType = {
  idOSClient: idOSClient;
  withSigner: idOSClientWithUserSigner;
  isLoading: boolean;
  refresh: () => Promise<void>;
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

export const useIdOSLoggedIn = (): idOSClientLoggedIn | null => {
  const context = useContext(IDOSClientContext);
  if (!context) {
    throw new Error('useIdOSLoggedIn must be used within an IdOSProvider');
  }

  if (context.idOSClient.state === 'logged-in') {
    return context.idOSClient as idOSClientLoggedIn;
  }

  return null;
};
