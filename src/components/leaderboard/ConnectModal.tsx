import CloseButton from '@/components/CloseButton';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { WalletConnector } from '../wallets/WalletConnector';

export default function WalletGate({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[30] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-md bg-neutral-950 rounded-2xl border border-neutral-800 overflow-hidden mx-4"
      >
        {/* Header */}
        <div className="flex items-center justify-end px-6 pt-6 bg-neutral-800/60 border-neutral-700 rounded-t-2xl">
          <CloseButton onClose={onClose} />
        </div>
        {/* Body */}
        <div className="px-6 pb-6 bg-neutral-800/60">
          <div className="flex flex-col items-center gap-4">
            <span className="text-base font-semibold text-center text-idos-seasalt">
              Connect your wallet to get started.
            </span>
            <WalletConnector />
            <div className="text-sm text-neutral-400 mt-6 text-center">
              By connecting a wallet I agree to the{' '}
              <a
                href="https://www.idos.network/legal/user-agreement"
                className="text-aquamarine-600 hover:text-aquamarine-400 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                User Agreement
              </a>{' '}
              and confirm I read the{' '}
              <a
                href="https://www.idos.network/legal/privacy-policy"
                className="text-aquamarine-600 hover:text-aquamarine-400 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>{' '}
              and{' '}
              <a
                href="https://www.idos.network/legal/transparency-document"
                className="text-aquamarine-600 hover:text-aquamarine-400 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Transparency Document
              </a>
              .
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
