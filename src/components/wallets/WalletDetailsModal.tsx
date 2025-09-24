import CloseButton from '@/components/CloseButton';
import SmallSecondaryButton from '@/components/SmallSecondaryButton';
import { useToast } from '@/hooks/useToast';
import { useWalletConnector } from '@/hooks/useWalletConnector';
import LogoutIcon from '@/icons/logout';
import { useIdosStore } from '@/stores/idosStore';
import truncateAddress from '@/utils/address';
import { addressGradient } from '@/utils/gradient';
import {
  profileStatusStyles,
  profileStatusTexts,
} from '@/utils/profile-status';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface WalletDetailsModalProps {
  isOpen: boolean;
  network: string;
  address: string;
  profileStatus: string;
  onClose: () => void;
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
  const { resetStore } = useIdosStore();
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
      localStorage.removeItem('onboardingToastShown');
      await resetStore();
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

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm"
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
              {/* Balance */}
              {/* <span className="text-sm text-neutral-400 font-['Inter']">
                {balance}
              </span>
              */}
              {/* Status */}
            </div>
            <div
              className={`flex font-['Inter'] text-[13px] font-medium items-center py-[2.5px] px-[5px] rounded-sm ${profileStatusStyle}`}
            >
              {profileStatusText}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between gap-5 mt-4 w-full">
              <SmallSecondaryButton
                onClick={handleSignOut}
                icon={<LogoutIcon />}
                disabled={isSigningOut}
                height="h-10"
                width="w-full"
              >
                {isSigningOut ? 'Disconnecting...' : 'Disconnect'}
              </SmallSecondaryButton>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
