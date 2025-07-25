import { useEffect, useRef } from 'react';
import CloseButton from '@/components/CloseButton';
import SmallSecondaryButton from '@/components/SmallSecondaryButton';

interface GemWalletInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GemWalletInstallModal({
  isOpen,
  onClose,
}: GemWalletInstallModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

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
        <div className="px-4 pb-8 bg-neutral-800/60">
          <div className="flex flex-col items-center gap-4">
            <span className="text-xl font-semibold text-neutral-50">
              Connect with GemWallet
            </span>

            <div className="flex flex-col items-center justify-center gap-4">
              <img
                src="/gem-wallet-logo.png"
                alt="GemWallet logo"
                className="w-16 h-16 rounded-full object-contain bg-neutral-900"
              />
              <span className="text-sm text-neutral-400 font-['Inter'] text-center">
                Please ensure that the GemWallet extension window is closed
                before connecting.
              </span>
              <span className="text-sm text-neutral-400 font-['Inter'] text-center">
                If it's not installed, please install GemWallet and refresh the
                page.
              </span>
              <div className="flex justify-center w-full mt-4">
                <SmallSecondaryButton
                  onClick={() => {
                    window.open(
                      'https://gemwallet.app/',
                      '_blank',
                      'noreferrer,noopener',
                    );
                  }}
                >
                  Download GemWallet
                </SmallSecondaryButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
