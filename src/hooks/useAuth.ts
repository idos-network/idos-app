import { authService, type AuthTokens } from '@/services/auth';
import { signNearMessage } from '@/utils/near/near-signature';
import { signStellarMessage } from '@/utils/stellar/stellar-signature';
import { signGemWalletTx } from '@/utils/xrpl/xrpl-signature';
import * as GemWallet from '@gemwallet/api';
import { useCallback, useEffect, useState } from 'react';
import { useSignMessage } from 'wagmi';
import { useNearWallet } from './useNearWallet';
import { useWalletConnector } from './useWalletConnector';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<{
    userId: string;
    publicAddress: string;
  } | null>(null);
  const walletConnector = useWalletConnector();
  const { signMessageAsync } = useSignMessage();
  const { selector } = useNearWallet();

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);

      if (authenticated) {
        const tokens = localStorage.getItem('auth_tokens');
        if (tokens) {
          try {
            const parsedTokens: AuthTokens = JSON.parse(tokens);
            setUser({
              userId: parsedTokens.userId || '',
              publicAddress: parsedTokens.publicAddress,
            });
          } catch (error) {
            console.error('Error parsing stored tokens:', error);
            authService.logout();
            setIsAuthenticated(false);
            setUser(null);
          }
        }
      }
    };

    checkAuth();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_tokens') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const authenticate = useCallback(async (): Promise<boolean> => {
    if (!walletConnector.isConnected || !walletConnector.connectedWallet) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);

    try {
      const wallet =
        walletConnector.isConnected && walletConnector.connectedWallet;

      const authMessage = await authService.getAuthMessage(
        wallet.address,
        wallet.publicKey || '',
      );

      if (!authMessage) {
        throw new Error('Authentication message is required');
      }

      let signature: string | undefined;
      const message = authMessage.message;

      if (wallet.type === 'evm') {
        if (!signMessageAsync) {
          throw new Error('signMessageAsync is required for EVM wallets');
        }
        signature = await signMessageAsync({
          message: message,
        });
      } else if (wallet.type === 'near') {
        const nearWallet = await selector?.wallet();
        if (!nearWallet) {
          throw new Error('Near wallet not found');
        }
        signature = await signNearMessage(nearWallet, message);
      } else if (wallet.type === 'stellar') {
        signature = await signStellarMessage(wallet, message);
      } else if (wallet.type === 'xrpl') {
        signature = await signGemWalletTx(GemWallet, message);
      } else {
        throw new Error(`Unsupported wallet type: ${wallet.type}`);
      }

      if (!signature) {
        throw new Error('Failed to sign message');
      }

      const tokens = await authService.verifySignature(
        wallet.address,
        wallet.publicKey || '',
        signature,
        authMessage.message,
        authMessage.nonce,
        wallet.type,
      );

      setIsAuthenticated(true);
      authService.saveTokensToStorage(tokens);
      setUser({
        userId: tokens.userId || '',
        publicAddress: tokens.publicAddress,
      });

      return true;
    } catch (error) {
      console.error('Authentication failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [walletConnector.isConnected, walletConnector.connectedWallet]);

  const logout = useCallback(() => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  return {
    isAuthenticated,
    isLoading,
    user,
    authenticate,
    logout,
  };
}
