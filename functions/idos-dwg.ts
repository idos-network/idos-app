import type { Config, Context } from "@netlify/functions";
import { createResponse } from "./utils/response";

export default async (_request: Request, _context: Context) => {
  const publicKeys = process.env.VITE_ISSUER_SIGNING_PUBLIC_KEYS?.split(',').map(k => k.trim());

  if (!publicKeys || publicKeys.length === 0) {
    throw new Error("VITE_ISSUER_SIGNING_PUBLIC_KEYS is not set");
  }

  const keyCount = publicKeys.length;

  // Get a random key index
  const keyIndex = Math.floor(Math.random() * keyCount) + 1;
  console.log(`[idOS] Using key index: ${keyIndex} - ${publicKeys[keyIndex - 1]}...`);

  return createResponse({
    time: Date.now(),
    publicKey: publicKeys[keyIndex - 1],
  }, 200);
}

export const config: Config = {
  path: '/api/idos-dwg',
  method: 'GET',
};
