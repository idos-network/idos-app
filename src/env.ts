import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {},

  /**
   * The prefix that client-side variables must have. This is enforced both at
   * a type-level and at runtime.
   */
  clientPrefix: 'VITE_',

  client: {
    VITE_WALLET_CONNECT_PROJECT_ID: z.string().min(1),
    VITE_OWNERSHIP_PROOF_MESSAGE: z.string().min(1),
    VITE_GRANTEE_WALLET_ADDRESS: z.string().min(1),
    VITE_ISSUER_SIGNING_PUBLIC_KEY: z.string().min(1),
    VITE_EMBEDDED_WALLET_APP_URL: z.string().min(1),
    VITE_ONBOARDING_EMBEDDED_WALLET_APP_URL: z.string().min(1),
    VITE_TRANSAK_API_KEY: z.string().min(1),
    VITE_NEAR_RPC_URL: z.string().default('https://test.rpc.fastnear.com'),
    VITE_STELLAR_API_URL: z
      .string()
      .default('https://horizon-testnet.stellar.org'),
    VITE_XRPL_RPC_URL: z
      .string()
      .default('wss://s.altnet.rippletest.net:51233'),
    VITE_NEAR_STAKING_CONTRACT_ADDRESS: z.string().default(''),
    VITE_ETH_STAKING_CONTRACT_ADDRESS: z.string().min(1),
    VITE_IDOS_ENCLAVE_URL: z
      .string()
      .default('https://enclave.staging.idos.network/'),
    VITE_IDOS_NODE_URL: z
      .string()
      .default('https://nodes.staging.idos.network/'),
    VITE_NODE_ENV: z.string().default('development'),
    VITE_FACETEC_PRODUCTION_KEY: z.string().min(1),
    VITE_FACETEC_DEVICE_KEY_IDENTIFIER: z.string().min(1),
  },

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  runtimeEnv: import.meta.env,

  /**
   * By default, this library will feed the environment variables directly to
   * the Zod validator.
   *
   * This means that if you have an empty string for a value that is supposed
   * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
   * it as a type mismatch violation. Additionally, if you have an empty string
   * for a value that is supposed to be a string with a default value (e.g.
   * `DOMAIN=` in an ".env" file), the default value will never be applied.
   *
   * In order to solve these issues, we recommend that all new projects
   * explicitly specify this option as true.
   */
  emptyStringAsUndefined: true,
});

// Add isProduction as a computed property using VITE_NODE_ENV
export const isProduction = env.VITE_NODE_ENV === 'production';
