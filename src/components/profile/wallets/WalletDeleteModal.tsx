import CloseIcon from '@/components/icons/close';
import Spinner from '@/components/Spinner';
import { useIdOS } from '@/context/idos-context';
import { type IdosWallet } from '@/interfaces/idos-profile';
import { useEffect, useRef, useState } from 'react';

interface WalletDeleteModalProps {
  isOpen: boolean;
  wallet: IdosWallet | null;
  onClose: () => void;
  onSuccess?: () => void;
  onWalletDeleted?: () => void;
  onError?: (error: string) => void;
}

export function WalletDeleteModal({
  isOpen,
  wallet,
  onClose,
  onWalletDeleted,
  onError,
}: WalletDeleteModalProps) {
  const { idOSClient } = useIdOS();
  const [isDeleting, setIsDeleting] = useState(false);
  const [_error, setError] = useState<string | null>(null);
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
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleDeleteWallet = async () => {
    if (!wallet) return;
    setIsDeleting(true);
    setError(null);
    try {
      // Try to use removeWallet if available, fallback to removeWallets or similar
      if (typeof (idOSClient as any).removeWallet === 'function') {
        await (idOSClient as any).removeWallet(wallet.id);
      } else if (typeof (idOSClient as any).removeWallets === 'function') {
        await (idOSClient as any).removeWallets([wallet.id]);
      } else {
        throw new Error('Wallet removal method not available');
      }
      onWalletDeleted?.();
    } catch (err) {
      const errorMsg = 'Failed to delete wallet. Please try again.';
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen || !wallet) return null;

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
        className="relative w-full max-w-lg mx-4 bg-neutral-950 gap-8 rounded-2xl border border-neutral-800 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 bg-neutral-800/60 border-neutral-700 rounded-t-2xl">
          <h2 className="text-xl leading-7 font-normal text-neutral-50">
            {isDeleting ? 'Deleting wallet' : 'Delete wallet'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-neutral-200 hover:bg-idos-grey2"
          >
            <CloseIcon className="w-3 h-3" />
          </button>
        </div>
        {/* Body */}
        <div className="px-6 pb-6 pt-8 bg-neutral-800/60">
          {isDeleting ? (
            <div className="space-y-4">
              <p className="text-neutral-200">
                Deleting wallet{' '}
                <span className="text-green-200 font-semibold">
                  {wallet.address}
                </span>
              </p>
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="gap-2 flex flex-col">
                <p className="text-neutral-400 text-sm font-['Inter']">
                  Do you want to delete this wallet from the idOS? This action
                  cannot be undone.
                </p>
                <div className="px-3 py-2 rounded-md bg-neutral-800 text-sm font-mono text-neutral-300">
                  {wallet.address}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-idos-grey2 hover:bg-idos-grey3 text-idos-seasalt rounded-lg transition-colors"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteWallet}
                  className="px-4 py-2 bg-neutral-700/70 text-[#EA8E8F] hover:bg-neutral-700 rounded-lg transition-colors"
                  disabled={isDeleting}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WalletDeleteModal;
