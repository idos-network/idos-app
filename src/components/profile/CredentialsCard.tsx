import { useCredentials } from '@/hooks/useCredentials';
import type { idOSCredential } from '@idos-network/client';
import z from 'zod';

const CredentialPublicNotesSchema = z.object({
  level: z.string(),
  type: z.string(),
  status: z.string(),
  issuer: z.string(),
  id: z.string(),
  shares: z.union([z.string(), z.number()]).optional(),
});

type CredentialPublicNotes = z.infer<typeof CredentialPublicNotesSchema>;

export function CredentialsCard() {
  const { credentials, isLoading, error } = useCredentials();

  if (isLoading) return <div>Loading credentials...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex h-full flex-col gap-6 overflow-hidden rounded-2xl border border-idos-grey2 bg-idos-grey1 p-6">
      {/* Header Section */}
      <div className="flex">
        <h1 className="font-bold text-4xl text-idos-seasalt">Credentials</h1>
      </div>

      {/* Table Section */}
      <div className="mt-6 flex-grow overflow-x-auto">
        <table className="w-full table-auto text-sm">
          <thead>
            <tr className="border-idos-grey2/20 border-b text-left text-idos-grey4 text-sm">
              <th className="w-1/5 px-4 pb-3">Level</th>
              <th className="w-1/5 px-4 pb-3">Type</th>
              <th className="w-1/5 px-4 pb-3">Status</th>
              <th className="w-1/5 px-4 pb-3">Issuer</th>
              <th className="w-1/5 px-4 pb-3">Shares</th>
            </tr>
          </thead>
          <tbody>
            {(credentials instanceof Promise ? [] : credentials)
              .filter((cred: idOSCredential) => {
                return cred.public_notes !== '';
              })
              .map((cred: idOSCredential) => {
                let parsed: CredentialPublicNotes | null = null;
                try {
                  parsed = CredentialPublicNotesSchema.parse(
                    JSON.parse(cred.public_notes),
                  );
                } catch (_e) {
                  parsed = null;
                }
                return (
                  <tr
                    key={cred.id}
                    className="border-idos-grey2/20 border-b text-idos-seasalt text-lg"
                  >
                    <td className="w-1/5 px-4 py-4">{parsed?.level || '-'}</td>
                    <td className="w-1/5 px-4 py-4">{parsed?.type || '-'}</td>
                    <td className="w-1/5 px-4 py-4">{parsed?.status || '-'}</td>
                    <td className="w-1/5 px-4 py-4">{parsed?.issuer || '-'}</td>
                    <td className="w-1/5 px-4 py-4">{parsed?.shares ?? '1'}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Buttons Section */}
      <div className="mt-6 flex flex-none justify-between gap-4 font-medium text-lg">
        <div className="flex gap-4">
          <button className="rounded-md bg-idos-grey2 px-4 py-2 text-idos-seasalt">
            View details
          </button>
          <button className="rounded-md bg-idos-grey2 px-4 py-2 text-idos-seasalt">
            Manage grants
          </button>
        </div>
        <button className="rounded-md bg-idos-grey2 px-4 py-2 text-idos-seasalt">
          Delete
        </button>
      </div>
    </div>
  );
}
