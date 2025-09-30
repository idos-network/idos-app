import { z } from 'zod';

export const dwgSchema = z.object({
  owner_wallet_identifier: z.string(),
  grantee_wallet_identifier: z.string(),
  issuer_public_key: z.string(),
  id: z.string(),
  access_grant_timelock: z.string(),
  not_usable_before: z.string(),
  not_usable_after: z.string(),
});

export const idosDWGSchema = z.object({
  delegatedWriteGrant: dwgSchema,
  signature: z.string(),
  message: z.string(),
});

export type DWG = z.infer<typeof dwgSchema>;

export type IdosDWG = z.infer<typeof idosDWGSchema>;
