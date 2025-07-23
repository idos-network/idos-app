import { useEffect, useRef, useState } from 'react';
import { useWalletConnector } from '@/hooks/useWalletConnector';
import { useToast } from '@/hooks/useToast';
import {
  profileStatusStyles,
  profileStatusTexts,
} from '@/utils/profile-status';
import CloseButton from '@/components/CloseButton';
import { CopyIcon } from '@/icons/copy';
import { LogoutIcon } from '@/icons/logout';
import SmallSecondaryButton from '@/components/SmallSecondaryButton';
import { addressGradient } from '@/utils/gradient';

interface WalletDetailsModalProps {
  isOpen: boolean;
  network: string;
  address: string;
  profileStatus: string;
  onClose: () => void;
}

function truncateAddress(address: string): string {
  if (address.length <= 10) {
    return address;
  }
  return `${address.slice(0, 5)}...${address.slice(-5)}`;
}

export default function WalletDetailsModal({
  isOpen,
  network,
  address,
  profileStatus,
  onClose,
}: WalletDetailsModalProps) {
  const { disconnect } = useWalletConnector();
  const { showToast } = useToast();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const profileStatusStyle = profileStatusStyles[profileStatus];
  const profileStatusText = profileStatusTexts[profileStatus];

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await disconnect();
      onClose();
    } catch (error) {
      showToast({
        type: 'error',
        message: 'Failed to sign out. Please try again.',
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleCopyAddress = () => {
    showToast({ type: 'success', message: 'Copied!' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-900/50 rounded-2xl backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-[366px] bg-neutral-950 rounded-2xl border border-neutral-800 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-end px-4 pt-4 bg-neutral-800/60 border-neutral-700 rounded-t-2xl">
          <CloseButton onClose={onClose} />
        </div>
        {/* Body */}
        <div className="px-4 pb-4 bg-neutral-800/60">
          <div className="flex flex-col items-center gap-4">
            <div
              className="flex items-center justify-center w-16 h-16 rounded-full"
              style={{
                background: addressGradient(address || ''),
              }}
            ></div>
            <div className="flex flex-col items-center">
              {/* Address */}
              <span className="text-xl font-semibold text-neutral-50">
                {network === 'near' ? address : truncateAddress(address)}
              </span>
              <span className="text-sm text-neutral-400 font-['Inter']">
                0 ETH
              </span>
              {/* Status */}
            </div>
            <div
              className={`flex font-['Inter'] text-[13px] h-[21px] font-medium items-center px-[5px] rounded-sm ${profileStatusStyle}`}
            >
              {profileStatusText}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between gap-5">
              <SmallSecondaryButton
                onClick={handleCopyAddress}
                icon={<CopyIcon />}
                height="h-10"
                width="w-[156px]"
              >
                Copy Address
              </SmallSecondaryButton>
              <SmallSecondaryButton
                onClick={handleSignOut}
                icon={<LogoutIcon />}
                disabled={isSigningOut}
                height="h-10"
                width="w-[156px]"
              >
                {isSigningOut ? 'Disconnecting...' : 'Disconnect'}
              </SmallSecondaryButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
