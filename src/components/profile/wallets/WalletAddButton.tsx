import SmallPrimaryButton from '@/components/SmallPrimaryButton';
import AddIcon from '@/components/icons/add';
import { useIdosStore } from '@/stores/idosStore';
import { useState } from 'react';
import { handleOpenWalletPopup } from './WalletAdder';

export default function WalletAddButton() {
  const [isLoading] = useState(false);
  const { addingWallet } = useIdosStore();

  return (
    <div className="flex flex-col gap-2 items-start">
      <SmallPrimaryButton
        icon={<AddIcon />}
        onClick={handleOpenWalletPopup}
        disabled={addingWallet}
        className="bg-aquamarine-400 text-neutral-950 hover:bg-aquamarine-600"
      >
        {isLoading ? 'Connecting...' : 'Add Wallet'}
      </SmallPrimaryButton>
    </div>
  );
}
