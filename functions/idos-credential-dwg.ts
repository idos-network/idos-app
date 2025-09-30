import { clearUserPopCredentialId, getUserById } from '@/db/user';
import type { Config, Context } from '@netlify/functions';
import { type DWG } from '@/interfaces/idos-credential';
import { z } from 'zod';


const DWG = z.object({
  identifier: z.string(),
  grantee_wallet_identifier: z.string(),
  issuer_public_key: z.string()
});


export default async (request: Request, _context: Context) => {

  const { identifier, grantee_wallet_identifier, issuer_public_key } = DWG.parse(request.json());

  const currentTimestamp = Date.now() - 5 * 60 * 1000; // make it 5 minutes before just in case
  const currentDate = new Date(currentTimestamp);
  const notUsableAfter = new Date(currentTimestamp + 24 * 60 * 60 * 1000);

  const delegatedWriteGrant: DWG = {
    owner_wallet_identifier: identifier,
    grantee_wallet_identifier: grantee_wallet_identifier,
    issuer_public_key: issuer_public_key,
    id: crypto.randomUUID(),
    access_grant_timelock: currentDate.toISOString().replace(/.\d+Z$/g, 'Z'), // Need to cut milliseconds to have 2025-02-11T13:35:57Z datetime format
    not_usable_before: currentDate.toISOString().replace(/.\d+Z$/g, 'Z'),
    not_usable_after: notUsableAfter.toISOString().replace(/.\d+Z$/g, 'Z'),
  };

  console.log(delegatedWriteGrant);

  return new Response(JSON.stringify(delegatedWriteGrant), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}


export const config: Config = {
  path: '/api/idos-credential-dwg',
  method: 'POST',
};
