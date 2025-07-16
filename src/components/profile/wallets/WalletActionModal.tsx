import { useEffect, useRef, useState } from 'react';
import { WalletDeleteModal } from './WalletDeleteModal';
import { type IdosWallet } from '@/interfaces/idos-profile';

interface WalletActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  position: { x: number; y: number } | null;
  walletId?: string;
  wallets: IdosWallet[];
  refetch: () => void;
}

export function WalletActionModal({
  isOpen,
  onClose,
  position,
  walletId,
  wallets,
  refetch,
}: WalletActionModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const selectedWallet: IdosWallet | undefined = wallets.find(
    (wallet) => wallet.id === walletId,
  );

  useEffect(() => {
    if (isOpen) {
      setIsDeleteModalOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    setIsDeleteModalOpen(false);
  }, [walletId]);

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

  return (
    <>
      {isOpen && position && (
        <div
          ref={modalRef}
          className="fixed z-50 w-[148px]"
          style={{
            left: position.x,
            top: position.y,
          }}
        >
          <div className="rounded-lg bg-neutral-800 overflow-hidden divide-y divide-neutral-700">
            <button
              onClick={() => {
                setIsDeleteModalOpen(true);
                onClose();
              }}
              className="w-full px-3 text-left text-[#EB9595] hover:bg-idos-grey3 transition-colors text-sm font-semibold h-10"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {walletId && (
        <>
          <WalletDeleteModal
            wallet={selectedWallet || null}
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
            }}
            onWalletDeleted={() => {
              setIsDeleteModalOpen(false);
              refetch();
            }}
            refetch={refetch}
          />
        </>
      )}
    </>
  );
}
