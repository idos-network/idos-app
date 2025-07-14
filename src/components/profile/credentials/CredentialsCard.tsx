import { useCredentials } from '@/hooks/useCredentials';
import { useCredentialDetails } from '@/hooks/useCredentialDetails';
import type { idOSCredential } from '@idos-network/client';
import z from 'zod';
import { useState, useEffect, useMemo } from 'react';
import { CredentialDetailsModal } from '@/components/profile/credentials/CredentialDetailsModal';
import { CredentialActionModal } from '@/components/profile/credentials/CredentialActionModal';
import Spinner from '@/components/onboarding/components/Spinner';
import { MoreVertIcon } from '@/components/icons/more-vert';

const CredentialPublicNotesSchema = z.object({
  level: z.string(),
  type: z.string(),
  status: z.string(),
  issuer: z.string(),
  id: z.string(),
  shares: z.union([z.string(), z.number()]).optional(),
});

type CredentialPublicNotes = z.infer<typeof CredentialPublicNotesSchema>;

export default function CredentialsCard() {
  const { credentials, isLoading, error } = useCredentials();
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

  if (isLoading) return <div>Loading credentials...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex h-full flex-col gap-6 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-800/60 p-6">
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
                      className="rounded-md p-2 text-neutral-200 hover:bg-idos-grey2"
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
      />

      {/* Credential Details Modal */}
      <CredentialDetailsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCredentialId(null);
          setTimeout(() => window.location.reload(), 10);
        }}
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
          <Spinner />
        ) : detailsError ? (
          <div className="space-y-4">
            <div className="rounded-lg bg-red-900/20 border border-red-500/20 p-4">
              <h3 className="mb-2 font-semibold text-red-400">Error</h3>
              <p className="text-red-300">{detailsError.message}</p>
            </div>
          </div>
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
