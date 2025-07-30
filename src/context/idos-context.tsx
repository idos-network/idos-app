import { createContext, useContext } from 'react';
import {
  type idOSClient,
  idOSClientWithUserSigner,
} from '@idos-network/client';

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
