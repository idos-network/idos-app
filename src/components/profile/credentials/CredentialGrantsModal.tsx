import {
  useFetchGrants,
  useRevokeGrant,
  type idOSGrant,
} from '@/hooks/useGrants';
import { timelockToMs, timelockToDate } from '@/utils/time';
import Spinner from '@/components/onboarding/components/Spinner';
import CloseButton from '@/components/CloseButton';
import SmallSecondaryButton from '@/components/SmallSecondaryButton';

type CredentialGrantsModalProps = {
  credentialId: string;
  isOpen: boolean;
  onClose: () => void;
  onError?: (error: string) => void;
  onSuccess?: (msg: string) => void;
};

function generateGrantId(grant: idOSGrant): string {
  const { id, data_id, ag_grantee_wallet_identifier, locked_until } = grant;
  return [id, data_id, ag_grantee_wallet_identifier, locked_until].join('-');
}

const Shares = ({
  grants,
  onError,
  onSuccess,
  onClose,
}: {
  grants: idOSGrant[];
  onError?: (error: string) => void;
  onSuccess?: (msg: string) => void;
  onClose: () => void;
}) => {
  const revokeGrant = useRevokeGrant();

  if (grants.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-idos-grey4">
          You have not shared this credential with anyone.
        </p>
      </div>
    );
  }

  const onRevoke = async (grant: idOSGrant) => {
    try {
      await revokeGrant.mutate(grant);
      onSuccess?.('Grant revoked successfully');
      onClose();
    } catch (error) {
      if (onError) onError('Failed to revoke grant. Please try again.');
      console.error('Failed to revoke grant:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="gap-2 flex flex-col">
        <h3 className="text-lg leading-7 font-medium text-neutral-50">
          Credential Grants Access Center
        </h3>
        <p className="text-neutral-400 text-sm font-['Inter']">
          This is where you can manage your credentials grants. You can choose
          which access is revoked or granted.
        </p>
      </div>

      <div className="rounded-lg border border-neutral-800 overflow-hidden font-['Inter']">
        <table className="w-full">
          <thead>
            <tr className="bg-neutral-800/60 text-neutral-400 text-sm">
              <th className="text-left p-4 font-normal ">Consumer</th>
              <th className="text-left p-4 font-normal">Locked until</th>
              <th className="text-right p-4 font-normal"></th>
            </tr>
          </thead>
          <tbody>
            {grants.map((grant) => (
              <tr
                key={generateGrantId(grant)}
                className="border-b border-idos-grey3 last:border-b-0"
              >
                <td className="p-4">
                  <div className="max-w-[140px] truncate text-neutral-200 text-sm font-normal">
                    {grant.ag_grantee_wallet_identifier}
                  </div>
                </td>
                <td className="p-4 text-neutral-200 text-sm font-normal">
                  {+grant.locked_until
                    ? timelockToDate(+grant.locked_until)
                    : 'No timelock'}
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end">
                    <SmallSecondaryButton
                      disabled={
                        timelockToMs(+grant.locked_until) >= Date.now() ||
                        (revokeGrant.isPending &&
                          revokeGrant.variables?.id === grant.id)
                      }
                      onClick={() => onRevoke(grant)}
                      danger={true}
                    >
                      Revoke
                    </SmallSecondaryButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export function CredentialGrantsModal({
  credentialId,
  isOpen,
  onClose,
  onError,
  onSuccess,
}: CredentialGrantsModalProps) {
  const grants = useFetchGrants({ credentialId });

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-900/50 rounded-2xl backdrop-blur-[1px]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 bg-neutral-950 gap-8 rounded-2xl border border-neutral-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 bg-neutral-800/60 border-neutral-700 rounded-t-2xl">
          <h2 className="text-xl leading-7 font-normal text-neutral-50">
            Grants Center
          </h2>
          <CloseButton onClose={onClose} />
        </div>

        {/* Body */}
        <div className="px-6 pb-6 pt-8 bg-neutral-800/60 rounded-b-2xl">
          {grants.isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : grants.isError ? (
            <div className="text-center py-8">
              <p className="text-red-400 mb-4">
                Something went wrong, please retry.
              </p>
              <button
                onClick={() => grants.refetch()}
                className="px-4 py-2 bg-idos-grey2 hover:bg-idos-grey3 text-idos-seasalt rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          ) : grants.isSuccess ? (
            <Shares
              grants={grants.data}
              onError={onError}
              onSuccess={onSuccess}
              onClose={onClose}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
