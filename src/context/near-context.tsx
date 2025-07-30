import type { Account, WalletSelector } from '@near-wallet-selector/core';
import { type WalletSelectorModal } from '@near-wallet-selector/modal-ui';
import React from 'react';

export interface NearWalletContextValue {
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
