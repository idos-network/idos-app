import { z } from 'zod';

export const idosDWGSchema = z.object({
  delegatedWriteGrant: z.object({
    owner_wallet_identifier: z.string(),
    grantee_wallet_identifier: z.string(),
    issuer_public_key: z.string(),
    id: z.string(),
    access_grant_timelock: z.string(),
    not_usable_before: z.string(),
    not_usable_after: z.string(),
  }),
  signature: z.string(),
  message: z.string(),
});

export type IdosDWG = z.infer<typeof idosDWGSchema>;
