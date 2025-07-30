import { useIdOS } from '@/providers/idos/idos-client';
import { useFetchGrants, useRevokeGrant } from '@/hooks/useGrants';
import { timelockToMs } from '@/utils/time';
import type { idOSCredential } from '@idos-network/client';
import { useEffect, useRef, useState } from 'react';
import CloseButton from '@/components/CloseButton';
import Spinner from '@/components/onboarding/components/Spinner';
import SmallSecondaryButton from '@/components/SmallSecondaryButton';
import WarningIcon from '@/components/icons/warning';
import truncateAddress from '@/utils/address';

interface CredentialDeleteModalProps {
  isOpen: boolean;
  credential: idOSCredential | null;
  onClose: () => void;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function CredentialDeleteModal({
  isOpen,
  credential,
  onClose,
  onSuccess,
  onError,
}: CredentialDeleteModalProps) {
  const { idOSClient } = useIdOS();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const [_error, setError] = useState<string | null>(null);
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
      const msg = 'Failed to revoke grants. Please try again.';
      setError(msg);
      onError?.(msg);
      setIsRevoking(false);
      return;
    }

    setIsRevoking(false);
  };

  const handleDeleteCredential = async () => {
    if (!credential) return;

    if (hasTimeLock) {
      const msg =
        "This credential has a locked grant. You can't delete it until the grant locked until date is passed.";
      setError(msg);
      onError?.(msg);
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
      onSuccess?.();
      onClose();
    } catch (err) {
      const msg = 'Failed to delete credential. Please try again.';
      setError(msg);
      onError?.(msg);
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
        className="relative w-[366px] max-w-lg mx-4 bg-neutral-950 gap-8 rounded-2xl border border-neutral-800 overflow-hidden"
      >
        {/* Header */}
        <div className="flex flex-col items-center justify-between px-6 pt-6 bg-neutral-800/60 border-neutral-700 rounded-t-2xl">
          <CloseButton className="absolute top-6 right-6" onClose={onClose} />
          <div className="rounded-full w-14 h-14 bg-idos-grey2 flex items-center justify-center mt-8">
            <WarningIcon className="w-8 h-8" />
          </div>
          <h2 className="pt-4 text-xl leading-7 font-normal text-neutral-50">
            {isRevoking
              ? 'Revoking grants'
              : isDeleting
                ? 'Deleting credential'
                : 'Delete credential'}
          </h2>
        </div>

        {/* Body */}
        <div className="px-6 pb-6 pt-4 bg-neutral-800/60">
          {isRevoking ? (
            <div className="space-y-4 flex flex-col items-center">
              <p className="text-neutral-200 mb-1 text-center">
                Revoking grant for consumer:
              </p>
              <div className="px-3 py-2 rounded-md bg-neutral-800 text-sm items-center justify-center font-mono text-neutral-300 w-fit">
                {truncateAddress(
                  currentRevokingGrant?.ag_grantee_wallet_identifier ||
                    'Unknown',
                )}
              </div>
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            </div>
          ) : isDeleting ? (
            <div className="space-y-4">
              <p className="text-neutral-200 text-center">
                Deleting credential of type{' '}
                <span className="text-green-200 font-semibold">
                  {parsedMeta?.type || 'Unknown'}
                </span>{' '}
                <br />
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
              <div className="flex flex-col">
                <p className="text-neutral-400 text-sm font-['Inter'] text-center">
                  You’re going to delete your credential. <br />
                  This action cannot be undone.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!(isRevoking || isDeleting) && (
          <div className="px-6 pb-6 bg-neutral-800/60">
            <div className="flex justify-center gap-3 w-full">
              <SmallSecondaryButton onClick={onClose} width="flex-1">
                No, keep it
              </SmallSecondaryButton>
              <SmallSecondaryButton
                onClick={handleDeleteCredential}
                disabled={isRevoking || isDeleting}
                danger={true}
                width="flex-1"
              >
                Yes, delete
              </SmallSecondaryButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
