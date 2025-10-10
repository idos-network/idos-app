import { updateWallchainLeaderboard } from '@/db/wallchain';
import axios from 'axios';
import type { Config } from '@netlify/functions';
import { parseWithSchema } from '@/api/parser';
import z from 'zod';

const EpochEntrySchema = z.object({
  xInfo: z.object({ username: z.string().min(1) }),
  relativeMindshare: z.number(),
});

const WallchainResponseSchema = z.object({
  epochs: z
    .object({
      epoch_1: z.array(EpochEntrySchema).default([]),
    })
    .default({ epoch_1: [] }),
});

export default async (_req: Request) => {
  const apiUrl = process.env.WALLCHAIN_API_URL as string;
  if (!apiUrl) {
    throw new Error('WALLCHAIN_API_URL is not set');
  }

  const response = await axios.get(apiUrl, {
    headers: { accept: 'application/json' },
    validateStatus: () => true,
  });
  if (response.status < 200 || response.status >= 300) {
    throw new Error(`Failed to fetch wallchain data: ${response.status}`);
  }

  const parsed = parseWithSchema(response.data, WallchainResponseSchema);
  const entries = parsed.epochs?.epoch_1;

  const rows = entries
    ?.map((entry) => ({
      username: '@' + entry?.xInfo?.username,
      relativeMindshare: Number(entry?.relativeMindshare ?? 0),
    }))
    .filter((r) => r.username && !Number.isNaN(r.relativeMindshare));

  await updateWallchainLeaderboard(
    rows as { username: string; relativeMindshare: number }[],
  );
};

export const config: Config = {
  schedule: '30 9 * * *',
};
