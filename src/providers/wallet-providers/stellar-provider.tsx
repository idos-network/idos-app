import {
  type ISupportedWallet,
  StellarWalletsKit,
} from '@creit.tech/stellar-wallets-kit';
import type { PropsWithChildren } from 'react';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { derivePublicKey, stellarKit } from '@/utils/stellar/stellar-signature';

interface StellarWalletContextValue {
  kit: StellarWalletsKit;
  address: string | null;
  publicKey: string | null;
  isConnected: boolean;
  isLoading: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const StellarWalletContext =
  React.createContext<StellarWalletContextValue | null>(null);

export function useStellarWallet() {
  const context = useContext(StellarWalletContext);

  if (!context) {
    throw new Error(
      '`useStellarWallet` must be used within a `StellarWalletProvider`',
    );
  }

  return context;
}

export function StellarWalletProvider({ children }: PropsWithChildren) {
  const [kit, setKit] = useState<StellarWalletsKit | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const initializeStellarKit = useCallback(async () => {
    try {
      setKit(stellarKit);

      const storedAddress = localStorage.getItem('stellar-address');
      const storedWalletId = localStorage.getItem('stellar-wallet-id');
      const storedPublicKey = localStorage.getItem('stellar-public-key');

      if (storedAddress && storedWalletId && storedPublicKey) {
        setAddress(storedAddress);
        setIsConnected(true);
        setPublicKey(storedPublicKey);
      }
    } catch (error) {
      console.error('Failed to initialize Stellar Wallets Kit:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeStellarKit().catch((error) => {
      console.error('Stellar kit initialization failed:', error);
    });
  }, [initializeStellarKit]);

  const connect = useCallback(async () => {
    if (!kit) {
      throw new Error('Stellar kit not initialized');
    }

    try {
      setIsLoading(true);
      await kit.openModal({
        onWalletSelected: async (option: ISupportedWallet) => {
          kit.setWallet(option.id);
          const { address } = await kit.getAddress();
          const publicKey = await derivePublicKey(address);

          setAddress(address);
          setPublicKey(publicKey);
          setIsConnected(true);

          localStorage.setItem('stellar-address', address);
          localStorage.setItem('stellar-wallet-id', option.id);
          localStorage.setItem('stellar-public-key', publicKey);
        },
        onClosed: (error?: Error) => {
          if (error) {
            console.error('Modal closed with error:', error);
          }
        },
      });
    } catch (error) {
      console.error('Failed to connect to Stellar wallet:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [kit]);

  const disconnect = useCallback(async () => {
    setAddress(null);
    setIsConnected(false);
    localStorage.removeItem('stellar-address');
    localStorage.removeItem('stellar-wallet-id');
    localStorage.removeItem('stellar-public-key');
  }, []);

  const contextValue = useMemo<StellarWalletContextValue | null>(() => {
    if (!kit) {
      return null;
    }

    return {
      kit,
      address,
      publicKey,
      isConnected,
      isLoading,
      connect,
      disconnect,
    };
  }, [kit, address, publicKey, isConnected, isLoading, connect, disconnect]);

  if (isLoading) {
    return <div>loading</div>;
  }

  if (!contextValue) {
    return <div>Failed to initialize Stellar</div>;
  }

  return (
    <StellarWalletContext.Provider value={contextValue}>
      {children}
    </StellarWalletContext.Provider>
  );
}

export type { StellarWalletContextValue };
