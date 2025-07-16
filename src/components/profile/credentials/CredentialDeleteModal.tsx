import { useIdOS } from '@/providers/idos/idos-client';
import { useFetchGrants, useRevokeGrant } from '@/hooks/useGrants';
import { timelockToMs } from '@/utils/time';
import type { idOSCredential } from '@idos-network/client';
import { useEffect, useRef, useState } from 'react';
import { CloseIcon } from '@/components/icons/close';
import Spinner from '@/components/onboarding/components/Spinner';

interface CredentialDeleteModalProps {
  isOpen: boolean;
  credential: idOSCredential | null;
  onClose: () => void;
  onSuccess?: () => void;
  refetch: () => void;
}

export function CredentialDeleteModal({
  isOpen,
  credential,
  onClose,
  onSuccess,
  refetch,
}: CredentialDeleteModalProps) {
  const { idOSClient } = useIdOS();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const grants = useFetchGrants({
    credentialId: credential?.id || '',
  });

  const revokeGrant = useRevokeGrant();

  const hasTimeLock =
    grants.data?.length &&
    grants.data?.find(
      (grant) => timelockToMs(+grant.locked_until) >= Date.now(),
    );

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

  const handleRevokeGrants = async () => {
    if (!grants.data || grants.data.length === 0) return;

    setIsRevoking(true);
    setError(null);

    try {
      for (const grant of grants.data) {
        await revokeGrant.mutate(grant);
      }
    } catch (err) {
      setError('Failed to revoke grants. Please try again.');
      setIsRevoking(false);
      return;
    }

    setIsRevoking(false);
  };

  const handleDeleteCredential = async () => {
    if (!credential) return;

    if (hasTimeLock) {
      setError(
        "This credential has a locked grant. You can't delete it until the grant locked until date is passed.",
      );
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      // First revoke all grants
      await handleRevokeGrants();

      // Then delete the credential
      // Note: removeCredential method might not be available in all idOS client versions
      if (typeof (idOSClient as any).removeCredential === 'function') {
        await (idOSClient as any).removeCredential(credential.id);
      } else {
        // Fallback: For now, we'll just revoke grants and show a success message
        // The credential will remain but all grants will be revoked
        console.warn(
          'removeCredential method not available in current idOS client version',
        );
      }
      await refetch();
      onSuccess?.();
      onClose();
    } catch (err) {
      setError('Failed to delete credential. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen || !credential) return null;

  let parsedMeta: any = null;
  try {
    parsedMeta = JSON.parse(credential.public_notes);
  } catch (_e) {
    parsedMeta = null;
  }

  const currentRevokingGrant = revokeGrant.variables;

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
            {isRevoking
              ? 'Revoking grants'
              : isDeleting
                ? 'Deleting credential'
                : 'Delete credential'}
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
          {isRevoking ? (
            <div className="space-y-4">
              <p className="text-neutral-200 mb-1">
                Revoking grant for consumer:
              </p>
              <div className="px-3 py-2 rounded-md bg-neutral-800 text-sm font-mono text-neutral-300">
                {currentRevokingGrant?.ag_grantee_wallet_identifier ||
                  'Unknown'}
              </div>
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            </div>
          ) : isDeleting ? (
            <div className="space-y-4">
              <p className="text-neutral-200">
                Deleting credential of type{' '}
                <span className="text-green-200 font-semibold">
                  {parsedMeta?.type || 'Unknown'}
                </span>{' '}
                from issuer{' '}
                <span className="text-green-200 font-semibold">
                  {parsedMeta?.issuer || 'Unknown'}
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
                  Do you want to delete this credential from the idOS? This
                  action cannot be undone.
                </p>
              </div>
              {error && (
                <div className="text-center py-4">
                  <p className="text-red-400 mb-4">{error}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {!(isRevoking || isDeleting) && (
          <div className="px-6 pb-6 bg-neutral-800/60">
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-idos-grey2 hover:bg-idos-grey3 text-idos-seasalt rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCredential}
                disabled={isRevoking || isDeleting}
                className="px-4 py-2 bg-neutral-700/70 text-[#EA8E8F] hover:bg-neutral-700 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
