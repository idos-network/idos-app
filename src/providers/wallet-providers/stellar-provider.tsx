import Spinner from '@/components/Spinner';
import {
  StellarWalletContext,
  type StellarWalletContextValue,
} from '@/context/stellar-context';
import { derivePublicKey, stellarKit } from '@/utils/stellar/stellar-signature';
import {
  type ISupportedWallet,
  StellarWalletsKit,
} from '@creit.tech/stellar-wallets-kit';
import { Horizon } from '@stellar/stellar-sdk';
import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { parseUnits } from 'viem';

export function StellarWalletProvider({ children }: PropsWithChildren) {
  const [kit, setKit] = useState<StellarWalletsKit | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [balance, setBalance] = useState<bigint>(0n);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // TODO: update to mainnet
  const server = useMemo(
    () => new Horizon.Server('https://horizon-testnet.stellar.org'),
    [],
  );

  const fetchXlmBalance = useCallback(
    async (accountAddress: string): Promise<bigint> => {
      try {
        const account = await server.loadAccount(accountAddress);
        const xlmBalance = account.balances.find(
          (balance: any) => balance.asset_type === 'native',
        );
        const balance = xlmBalance
          ? BigInt(parseUnits(xlmBalance.balance, 6))
          : BigInt(0);
        return balance;
      } catch (error: any) {
        if (error?.name === 'NotFoundError') {
          console.warn(
            `Stellar account ${accountAddress} not found. Account may not be funded yet.`,
          );
          return BigInt(0); // Account doesn't exist yet (not funded)
        }
        console.error('Error fetching XLM balance:', error);
        return BigInt(0);
      }
    },
    [server],
  );

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

  useEffect(() => {
    if (isConnected && address && !isLoading) {
      fetchXlmBalance(address)
        .then(setBalance)
        .catch((error) => {
          console.error('Failed to fetch balance:', error);
        });
    }
  }, [isConnected, address, isLoading, fetchXlmBalance]);

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
    setPublicKey(null);
    setBalance(0n);
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
      balance,
      isConnected,
      isLoading,
      connect,
      disconnect,
    };
  }, [
    kit,
    address,
    publicKey,
    balance,
    isConnected,
    isLoading,
    connect,
    disconnect,
  ]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center ml-64 mt-6">
        <Spinner />
      </div>
    );
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
