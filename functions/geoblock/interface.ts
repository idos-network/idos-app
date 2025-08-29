import { z } from 'zod';

export const securitySchema = z.object({
  is_abuser: z.boolean(),
  is_attacker: z.boolean(),
  is_bogon: z.boolean(),
  is_cloud_provider: z.boolean(),
  is_proxy: z.boolean(),
  is_relay: z.boolean(),
  is_tor: z.boolean(),
  is_tor_exit: z.boolean(),
  is_vpn: z.boolean(),
  is_anonymous: z.boolean(),
  is_threat: z.boolean(),
});

export const countrySchema = z.object({
  code: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
});

export const locationSchema = z.object({
  country: countrySchema,
});

export const ipDataSchema = z.object({
  location: locationSchema,
  security: securitySchema,
});

export const geoblockConfigSchema = z.object({
  countries: z.array(countrySchema),
  security: securitySchema,
});

export type GeoblockConfig = z.infer<typeof geoblockConfigSchema>;
