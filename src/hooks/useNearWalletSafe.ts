import { useContext } from 'react';
import { NearWalletContext } from '@/providers/wallet-providers/near-provider';

export function useNearWalletSafe() {
  const context = useContext(NearWalletContext);

  if (!context) {
    throw new Error('useNearWalletSafe must be used within NearWalletProvider');
  }

  const { selector, modal, accounts, accountId } = context;

  // Safe wallet operations
  const signIn = async () => {
    try {
      modal.show();
    } catch (error) {
      console.error('Failed to show wallet modal:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      if (selector.isSignedIn()) {
        const wallet = await selector.wallet();
        await wallet.signOut();
      }
    } catch (error) {
      console.error('Failed to sign out:', error);
      throw error;
    }
  };

  const getWallet = async () => {
    if (!selector.isSignedIn()) {
      throw new Error('Please sign in first');
    }
    return await selector.wallet();
  };

  return {
    selector,
    modal,
    accounts,
    accountId,
    isSignedIn: selector.isSignedIn(),
    signIn,
    signOut,
    getWallet,
  };
}
