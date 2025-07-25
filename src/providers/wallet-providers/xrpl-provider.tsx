import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import * as GemWallet from '@gemwallet/api';
import { getGemWalletPublicKey } from '@/utils/xrpl/xrpl-signature';
import GemWalletInstallModal from '@/components/wallets/GemWalletInstallModal';

interface XrplWalletContextValue {
  address: string | null;
  publicKey: string | null;
  isConnected: boolean;
  isLoading: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

export const XrplWalletContext = createContext<XrplWalletContextValue | null>(
  null,
);

export function XrplWalletProvider({ children }: PropsWithChildren) {
  const [address, setAddress] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [_error, setError] = useState<string | null>(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // Try to restore connection from localStorage (optional, for UX parity)
  useEffect(() => {
    // No persistent storage for GemWallet, so just set loading to false
    setIsLoading(false);
  }, []);

  const connect = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Timeout')), 150);
    });

    try {
      const installed = await Promise.race([
        GemWallet.isInstalled(),
        timeoutPromise,
      ]);

      if (!installed?.result?.isInstalled) {
        setIsInstallModalOpen(true);
        setIsLoading(false);
        return;
      }

      const result = await getGemWalletPublicKey(GemWallet);
      if (!result) throw new Error('Failed to get wallet info');

      const { publicKey: pk, address: addr } = result;
      setAddress(addr);
      setPublicKey(pk);
      setIsConnected(true);
      localStorage.setItem('xrpl-connected', 'true');
    } catch (err) {
      // If it's a timeout or any other error, show the modal
      if (
        err instanceof Error &&
        (err.message === 'Timeout' || err.message.includes('GemWallet'))
      ) {
        setIsInstallModalOpen(true);
        setIsLoading(false);
        return;
      }

      setAddress(null);
      setPublicKey(null);
      setIsConnected(false);
      setError(err instanceof Error ? err.message : String(err));
      console.error('XRPL connection error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    setAddress(null);
    setPublicKey(null);
    setIsConnected(false);
    setError(null);
    localStorage.removeItem('xrpl-connected');
  }, []);

  const contextValue = useMemo<XrplWalletContextValue>(
    () => ({
      address,
      publicKey,
      isConnected,
      isLoading,
      connect,
      disconnect,
    }),
    [address, publicKey, isConnected, isLoading, connect, disconnect],
  );

  return (
    <XrplWalletContext.Provider value={contextValue}>
      {children}
      <GemWalletInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />
    </XrplWalletContext.Provider>
  );
}

export type { XrplWalletContextValue };
