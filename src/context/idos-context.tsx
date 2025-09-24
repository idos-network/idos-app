import { useIdosStore } from '@/stores/idosStore';
import {
  type idOSClient,
  type idOSClientLoggedIn,
  type idOSClientWithUserSigner,
} from '@idos-network/client';
import { createContext } from 'react';

type IdOSContextType = {
  idOSClient: idOSClient;
  setIdOSClient: (client: idOSClient) => void;
  withSigner: idOSClientWithUserSigner;
  isLoading: boolean;
  refresh: () => Promise<void>;
};

export const IDOSClientContext = createContext<IdOSContextType | undefined>(
  undefined,
);

export const useIdOS = () => {
  const { idOSClient, setIdOSClient, initializing } = useIdosStore();
  return { idOSClient, setIdOSClient, initializing };
};

export const useIdOSLoggedIn = (): idOSClientLoggedIn | null => {
  const { idOSClient } = useIdosStore();

  if (idOSClient && idOSClient.state === 'logged-in') {
    return idOSClient as idOSClientLoggedIn;
  }

  return null;
};
