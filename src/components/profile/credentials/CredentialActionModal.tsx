import { useEffect, useRef, useState } from 'react';
import { CredentialGrantsModal } from './CredentialGrantsModal';
import { CredentialDeleteModal } from './CredentialDeleteModal';

interface CredentialActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewDetails: () => void;
  position: { x: number; y: number } | null;
  credentialId?: string;
  credentials: any[];
  refetch: () => void;
  onError?: (error: string) => void;
  onSuccess?: (message: string) => void;
}

export function CredentialActionModal({
  isOpen,
  onClose,
  onViewDetails,
  position,
  credentialId,
  credentials,
  refetch,
  onError,
  onSuccess,
}: CredentialActionModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isGrantsModalOpen, setIsGrantsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const selectedCredential = credentials.find(
    (cred) => cred.id === credentialId,
  );

  useEffect(() => {
    if (isOpen) {
      setIsGrantsModalOpen(false);
      setIsDeleteModalOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    setIsGrantsModalOpen(false);
    setIsDeleteModalOpen(false);
  }, [credentialId]);

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
                onViewDetails();
                onClose();
              }}
              className="w-full px-3 text-left text-neutral-50 hover:bg-idos-grey3 transition-colors text-sm font-semibold h-10"
            >
              View Details
            </button>
            <button
              onClick={() => {
                setIsGrantsModalOpen(true);
                onClose();
              }}
              className="w-full px-3 text-left text-neutral-50 hover:bg-idos-grey3 transition-colors text-sm font-semibold h-10"
            >
              Manage grants
            </button>
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

      {credentialId && (
        <>
          <CredentialGrantsModal
            credentialId={credentialId}
            isOpen={isGrantsModalOpen}
            onClose={() => {
              setIsGrantsModalOpen(false);
            }}
            onError={onError}
            onSuccess={(msg) => {
              onSuccess?.(msg);
              refetch();
            }}
          />
          <CredentialDeleteModal
            credential={selectedCredential || null}
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
            }}
            onSuccess={() => {
              onSuccess?.('Credential deleted successfully');
              refetch();
            }}
            onError={onError}
          />
        </>
      )}
    </>
  );
}
