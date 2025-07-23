import { useState } from 'react';
import WalletDetailsModal from './WalletDetailsModal';
import { networks } from '@/utils/networks';
import {
  profileStatusStyles,
  profileStatusTexts,
} from '@/utils/profile-status';

function truncateAddress(address: string): string {
  if (address.length <= 10) {
    return address;
  }
  return `${address.slice(0, 5)}...${address.slice(-5)}`;
}

export default function WalletBar({
  network,
  address,
  profileStatus,
}: {
  network: string;
  address: string;
  profileStatus: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const selectedNetwork =
    networks.find((n) => n.icon === network) || networks[0];

  const profileStatusStyle = profileStatusStyles[profileStatus];
  const profileStatusText = profileStatusTexts[profileStatus];

  const handleClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div
        className="flex items-center gap-4 py-4 pl-1 pr-3 h-10 bg-neutral-800/50 rounded-full border border-neutral-800 font-['Inter'] cursor-pointer hover:bg-neutral-800/70 transition-colors"
        onClick={handleClick}
      >
        <div className="flex items-center gap-1.5 bg-neutral-800 rounded-full pr-4 pl-1 py-1">
          <div className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden">
            <img
              src={`/${selectedNetwork.icon}.png`}
              alt={selectedNetwork.name}
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-sm font-medium">{selectedNetwork.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-base text-neutral-400">
            {network === 'near' ? address : truncateAddress(address)}
          </span>
        </div>
        <div
          className={`flex text-[13px] font-medium items-center py-[2.5px] px-[5px] rounded-sm ${profileStatusStyle}`}
        >
          {profileStatusText}
        </div>
      </div>

      <WalletDetailsModal
        isOpen={isModalOpen}
        network={network}
        address={address}
        profileStatus={profileStatus}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
