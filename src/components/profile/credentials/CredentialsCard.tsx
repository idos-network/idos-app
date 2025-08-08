import { CredentialActionModal } from '@/components/profile/credentials/CredentialActionModal';
import { CredentialDetailsModal } from '@/components/profile/credentials/CredentialDetailsModal';
import { useCredentialDetails } from '@/hooks/useCredentialDetails';
import { useCredentials } from '@/hooks/useCredentials';
import MoreVertIcon from '@/icons/more-vert';
import type { idOSCredential } from '@idos-network/client';
import { useEffect, useMemo, useState } from 'react';
import z from 'zod';
import CredentialAccessModal from './CredentialAccessModal';

const CredentialPublicNotesSchema = z.object({
  level: z.string(),
  type: z.string(),
  status: z.string(),
  issuer: z.string(),
  id: z.string(),
  shares: z.union([z.string(), z.number()]).optional(),
});

type CredentialPublicNotes = z.infer<typeof CredentialPublicNotesSchema>;

interface CredentialsCardProps {
  onError?: (error: string) => void;
  onSuccess?: (message: string) => void;
}

export default function CredentialsCard({
  onError,
  onSuccess,
}: CredentialsCardProps) {
  const { credentials, isLoading, error, refetch } = useCredentials();
  const [selectedCredentialId, setSelectedCredentialId] = useState<
    string | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionModalPosition, setActionModalPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const {
    credential: detailedCredential,
    decryptedContent,
    isLoading: detailsLoading,
    error: detailsError,
  } = useCredentialDetails(isModalOpen ? selectedCredentialId : null);

  // Call onError if error occurs in fetching credentials
  useEffect(() => {
    if (error) onError?.(error.message);
  }, [error, onError]);

  // Call onError if error occurs in fetching credential details
  useEffect(() => {
    if (detailsError) onError?.(detailsError.message);
  }, [detailsError, onError]);

  const processedCredentials = useMemo(() => {
    if (credentials instanceof Promise) return [];

    return credentials
      .filter((cred: idOSCredential) => cred.public_notes !== '')
      .map((cred: idOSCredential) => {
        let parsed: CredentialPublicNotes | null = null;
        try {
          parsed = CredentialPublicNotesSchema.parse(
            JSON.parse(cred.public_notes),
          );
        } catch (_e) {
          parsed = null;
        }
        return { cred, parsed };
      });
  }, [credentials]);

  useEffect(() => {
    const enclaveElement = document.getElementById('idOS-enclave');
    if (enclaveElement) {
      if (detailsLoading) {
        enclaveElement.classList.add('loading');
      } else {
        enclaveElement.classList.remove('loading');
      }
    }
  }, [detailsLoading]);

  useEffect(() => {
    const enclaveElement = document.getElementById('idOS-enclave');
    if (enclaveElement) {
      if (isModalOpen) {
        enclaveElement.style.display = '';
      } else {
        enclaveElement.style.display = 'none';
      }
    }
  }, [isModalOpen]);

  if (isLoading) return null;

  const handleDetailsModalClose = () => {
    setIsModalOpen(false);
    setSelectedCredentialId(null);
  };

  return (
    <div className="flex h-full flex-col w-fit min-w-full gap-6 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-800/60 p-6">
      {/* Header Section */}
      <div className="flex">
        <h1 className="font-normal text-xl text-neutral-50">Credentials</h1>
      </div>

      {/* Table Section */}
      <div className="flex-grow overflow-x-auto">
        <table className="w-full table-auto text-sm font-['Inter']">
          <thead>
            <tr className="text-left text-neutral-400 text-sm bg-neutral-800 h-[52px]">
              <th className="w-1/5 px-4 font-normal rounded-l-[20px]">Level</th>
              <th className="w-1/5 px-4 font-normal">Type</th>
              <th className="w-1/5 px-4 font-normal">Status</th>
              <th className="w-1/5 px-4 font-normal">Issuer</th>
              <th className="w-1/5 px-4 font-normal">Shares</th>
              <th className="w-16 px-4 font-normal rounded-r-[20px]"></th>
            </tr>
          </thead>
          <tbody>
            {processedCredentials.map(({ cred, parsed }, index) => {
              const isLastRow = index === processedCredentials.length - 1;
              return (
                <tr
                  key={cred.id}
                  className={`text-neutral-200 text-base h-[52px] ${!isLastRow ? 'border-neutral-800 border-b' : ''}`}
                >
                  <td className="w-1/5 px-4">{parsed?.level || '-'}</td>
                  <td className="w-1/5 px-4">{parsed?.type || '-'}</td>
                  <td className="w-1/5 px-4">{parsed?.status || '-'}</td>
                  <td className="w-1/5 px-4">{parsed?.issuer || '-'}</td>
                  <td className="w-1/5 px-4">{parsed?.shares ?? '1'}</td>
                  <td className="w-16 px-4">
                    <button
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setActionModalPosition({
                          x: rect.right + 5,
                          y: rect.top,
                        });
                        setSelectedCredentialId(cred.id);
                        setIsActionModalOpen(true);
                      }}
                      className="rounded-md p-2 text-neutral-200 hover:bg-idos-grey2 cursor-pointer"
                      title="View details"
                    >
                      <MoreVertIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Credential Action Modal */}
      <CredentialActionModal
        isOpen={isActionModalOpen}
        onClose={() => {
          setIsActionModalOpen(false);
          setActionModalPosition(null);
        }}
        onViewDetails={() => {
          setIsModalOpen(true);
        }}
        position={actionModalPosition}
        credentialId={selectedCredentialId || undefined}
        credentials={credentials}
        refetch={refetch}
        onError={onError}
        onSuccess={onSuccess}
      />

      {/* Credential Details Modal */}
      <CredentialDetailsModal
        isOpen={isModalOpen}
        onClose={handleDetailsModalClose}
        loading={detailsLoading}
        downloadData={
          detailedCredential && !detailsLoading && !detailsError
            ? (() => {
                const publicNotesData = detailedCredential.public_notes
                  ? JSON.parse(detailedCredential.public_notes)
                  : null;
                return {
                  content: JSON.stringify(detailedCredential, null, 2),
                  filename: publicNotesData
                    ? `${publicNotesData.type || 'credential'}_${publicNotesData.issuer || 'unknown'}.json`
                    : 'credential.json',
                };
              })()
            : undefined
        }
      >
        {detailsLoading ? (
          <CredentialAccessModal
            isOpen={true}
            onClose={handleDetailsModalClose}
            title="Secure Access Required"
            subtitle="To protect your credentials, please unlock your account before viewing the details."
          />
        ) : detailsError ? (
          <CredentialAccessModal
            isOpen={true}
            onClose={handleDetailsModalClose}
            title="Error loading credential details"
            subtitle="Please try again later."
          />
        ) : detailedCredential ? (
          <div className="space-y-4">
            {decryptedContent && (
              <div className="bg-idos-grey2 p-4">
                <pre className="whitespace-pre-wrap text-sm text-idos-seasalt overflow-x-auto">
                  {(() => {
                    try {
                      return JSON.stringify(
                        JSON.parse(decryptedContent),
                        null,
                        2,
                      );
                    } catch (e) {
                      return decryptedContent;
                    }
                  })()}
                </pre>
              </div>
            )}
          </div>
        ) : null}
      </CredentialDetailsModal>
    </div>
  );
}
