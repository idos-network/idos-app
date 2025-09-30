import type { Config, Context } from '@netlify/functions';
import { type DWG } from '@/interfaces/idos-credential';




export default async (request: Request, _context: Context) => {
  try {
    const { identifier, grantee_wallet_identifier, issuer_public_key }: { identifier: string, grantee_wallet_identifier: string, issuer_public_key: string } = await request.json();


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


    return new Response(JSON.stringify(delegatedWriteGrant), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {

    return new Response(
      JSON.stringify({ error: 'Failed to generate dwg' }),
      {
        status: 500,
      },
    );
  }

}


export const config: Config = {
  path: '/api/idos-credential-dwg',
  method: 'POST',
};
