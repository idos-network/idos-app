import { CredentialActionModal } from '@/components/profile/credentials/CredentialActionModal';
import { CredentialDetailsModal } from '@/components/profile/credentials/CredentialDetailsModal';
import { useIdOS } from '@/context/idos-context';
import { useCredentialDetails } from '@/hooks/useCredentialDetails';
import MoreVertIcon from '@/icons/more-vert';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import CredentialAccessModal from './CredentialAccessModal';

const safeParse = (public_notes: string) => {
  try {
    return JSON.parse(public_notes);
  } catch (e) {
    return null;
  }
};

interface CredentialsCardProps {
  onError?: (error: string) => void;
  onSuccess?: (message: string) => void;
}

const useUserCredentials = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { idOSClient } = useIdOS();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useQuery({
    queryKey: ['credentials'],
    enabled: !!idOSClient && idOSClient.state === 'logged-in',
    queryFn: () => {
      return idOSClient && idOSClient.state === 'logged-in'
        ? idOSClient.getAllCredentials()
        : [];
    },
    // how to map elems from here
  });
};

export const useFetchAllGrants = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { idOSClient } = useIdOS();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useQuery({
    queryKey: ['grants'],
    enabled: !!idOSClient && idOSClient.state === 'logged-in',
    queryFn: async () => {
      if (!idOSClient || idOSClient.state !== 'logged-in') return [] as any[];
      return idOSClient.getAccessGrantsOwned();
    },
    retry: 1,
  });
};

export default function CredentialsCard({
  onError,
  onSuccess,
}: CredentialsCardProps) {
  const { data: credentials, isLoading, error, refetch } = useUserCredentials();
  const { data: grants } = useFetchAllGrants();
  const [selectedCredentialId, setSelectedCredentialId] = useState<
    string | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionModalPosition, setActionModalPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const getSharesCount = (credentialId: string) => {
    if (!grants || !credentials) return 0;

    const credentialIds = credentials
      .filter((credential) => credential.original_id === credentialId)
      .map((credential) => credential.id);

    return grants.filter((grant: any) => credentialIds.includes(grant.data_id))
      .length;
  };
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
            {credentials?.map((cred, index) => {
              const isLastRow = index === credentials.length - 1;
              console.log({ cred });
              const parsed = safeParse(cred.public_notes ?? '');
              console.log({ parsed });
              if (!parsed) return null;
              return (
                <tr
                  key={cred.id}
                  className={`text-neutral-200 text-base h-[52px] ${!isLastRow ? 'border-neutral-800 border-b' : ''}`}
                >
                  <td className="w-1/5 px-4">{parsed?.level || '-'}</td>
                  <td className="w-1/5 px-4">{parsed?.type || '-'}</td>
                  <td className="w-1/5 px-4">{parsed?.status || '-'}</td>
                  <td className="w-1/5 px-4">{parsed?.issuer || '-'}</td>
                  <td className="w-1/5 px-4">{getSharesCount(cred.id)}</td>
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
        credentials={credentials ?? []}
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
