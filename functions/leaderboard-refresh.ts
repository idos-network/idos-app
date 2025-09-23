import { refreshLeaderboard } from '@/db/leaderboard';
import type { Config } from '@netlify/functions';

export default async (_req: Request) => {
  await refreshLeaderboard();
};

export const config: Config = {
  schedule: '0 * * * *',
};
