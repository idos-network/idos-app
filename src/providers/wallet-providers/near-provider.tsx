import type { Account, WalletSelector } from '@near-wallet-selector/core';
import { setupWalletSelector } from '@near-wallet-selector/core';
import {
  setupModal,
  type WalletSelectorModal,
} from '@near-wallet-selector/modal-ui';
import { setupMeteorWallet } from '@near-wallet-selector/meteor-wallet';
import { setupHereWallet } from '@near-wallet-selector/here-wallet';
import '@near-wallet-selector/modal-ui/styles.css';
import type { PropsWithChildren } from 'react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { getNearFullAccessPublicKeys } from '@/utils/near/near-signature';

// Reference docs : https://docs.near.org/tools/wallet-selector

declare global {
  interface Window {
    nearSelector: WalletSelector;
    nearModal: WalletSelectorModal;
  }
}

interface NearWalletContextValue {
  selector: WalletSelector;
  modal: WalletSelectorModal;
  accounts: Account[];
  accountId: string | null;
  setAccounts: (accounts: Account[]) => void;
  isLoading: boolean;
  publicKey: string | null;
}

export const NearWalletContext =
  React.createContext<NearWalletContextValue | null>(null);

export function NearWalletProvider({ children }: PropsWithChildren) {
  const [selector, setSelector] = useState<WalletSelector | null>(null);
  const [modal, setModal] = useState<WalletSelectorModal | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [publicKey, setPublicKey] = useState<string | null>(null);

  const initializeWalletSelector = useCallback(async () => {
    try {
      const walletSelector = await setupWalletSelector({
        // network: import.meta.env.DEV ? 'testnet' : 'mainnet',
        network: 'testnet',
        debug: import.meta.env.DEV,
        modules: [setupMeteorWallet(), setupHereWallet()],
      });

      const walletModal = setupModal(walletSelector, {
        contractId: '', // Replace with actual contract ID or remove if not needed
        methodNames: [],
      });

      setSelector(walletSelector);
      setModal(walletModal);

      // Check for existing accounts on initialization (for page refresh)
      if (walletSelector.isSignedIn()) {
        try {
          const wallet = await walletSelector.wallet();
          // Additional check to ensure wallet is ready
          if (wallet && typeof wallet.getAccounts === 'function') {
            const existingAccounts = await wallet.getAccounts();
            setAccounts(existingAccounts);

            // Restore public key for existing session
            if (existingAccounts.length > 0) {
              try {
                const publicKey =
                  (
                    await getNearFullAccessPublicKeys(
                      existingAccounts[0]?.accountId,
                    )
                  )?.[0] || '';
                setPublicKey(publicKey);
              } catch (error) {
                console.error('Failed to restore NEAR public key:', error);
              }
            }
          }
        } catch (error) {
          console.error('Failed to restore existing accounts:', error);
          // Force sign out on error to prevent stuck state
          try {
            const wallet = await walletSelector.wallet();
            await wallet.signOut();
          } catch (signOutError) {
            console.error('Failed to sign out after error:', signOutError);
          }
        }
      }

      // Store in global scope for debugging
      if (typeof window !== 'undefined') {
        window.nearSelector = walletSelector;
        window.nearModal = walletModal;
      }
    } catch (error) {
      console.error('Failed to initialize NEAR wallet selector:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeWalletSelector().catch((error) => {
      console.error('Wallet selector initialization failed:', error);
      alert('Failed to initialize wallet selector. Please refresh the page.');
    });
  }, [initializeWalletSelector]);

  useEffect(() => {
    if (!selector || !modal) {
      return;
    }

    const signInSubscription = selector.on(
      'signedIn',
      async ({ accounts: signedInAccounts }) => {
        try {
          const publicKey =
            (
              await getNearFullAccessPublicKeys(signedInAccounts[0]?.accountId)
            )?.[0] || '';
          setPublicKey(publicKey);
          setAccounts(signedInAccounts);
        } catch (error) {
          console.error('Failed to get NEAR public key on sign in:', error);
          // Still set accounts even if public key fails
          setAccounts(signedInAccounts);
        }
      },
    );

    const signOutSubscription = selector.on('signedOut', () => {
      setAccounts([]);
      setPublicKey(null);
    });

    return () => {
      signInSubscription.remove();
      signOutSubscription.remove();
    };
  }, [selector, modal]);

  const contextValue = useMemo<NearWalletContextValue | null>(() => {
    if (!selector || !modal) {
      return null;
    }

    return {
      selector,
      modal,
      accounts,
      accountId: accounts[0]?.accountId ?? null,
      setAccounts,
      isLoading,
      publicKey,
    };
  }, [selector, modal, accounts, isLoading, publicKey]);

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (!contextValue) {
    return <div>Failed to initialize Near</div>;
  }

  return (
    <NearWalletContext.Provider value={contextValue}>
      {children}
    </NearWalletContext.Provider>
  );
}

export type { NearWalletContextValue };
